// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// 获取修复建议
export function getFixSuggestion(
  errorMessage: string, 
  jsonString: string, 
  position: number,
  t: (key: string) => string
): string | { fixDescription: string; autoFix: (input: string) => string } {
  // 检查是否缺少闭合的括号
  if (errorMessage.includes('Unexpected end of JSON input')) {
    const openBrackets = (jsonString.match(/[\[{]/g) || []).length;
    const closeBrackets = (jsonString.match(/[\]}]/g) || []).length;
    
    if (openBrackets > closeBrackets) {
      return {
        fixDescription: t('suggestions.missingClosingBracket'),
        autoFix: (input: string) => input + '}'.repeat(openBrackets - closeBrackets)
      };
    }
  }

  // 检查是否缺少引号
  if (errorMessage.includes('Unexpected token')) {
    const beforePosition = jsonString.substring(0, position);
    const lastColon = beforePosition.lastIndexOf(':');
    const lastComma = beforePosition.lastIndexOf(',');
    const lastBracket = beforePosition.lastIndexOf('}');
    
    if (lastColon > lastComma && lastColon > lastBracket) {
      return {
        fixDescription: t('suggestions.missingQuotesAroundKey'),
        autoFix: (input: string) => {
          const lines = input.split('\n');
          const lineIndex = beforePosition.split('\n').length - 1;
          const line = lines[lineIndex];
          const keyMatch = line.match(/(\w+)\s*:/);
          if (keyMatch) {
            lines[lineIndex] = line.replace(keyMatch[0], `"${keyMatch[1]}":`);
            return lines.join('\n');
          }
          return input;
        }
      };
    }
  }

  // 检查是否使用了单引号
  if (jsonString.includes("'")) {
    return {
      fixDescription: t('suggestions.singleQuotes'),
      autoFix: (input: string) => input.replace(/'/g, '"')
    };
  }

  // 检查是否缺少逗号
  if (errorMessage.includes('Unexpected token')) {
    const beforePosition = jsonString.substring(0, position);
    const lastValue = beforePosition.match(/([^,\s]+)\s*$/);
    if (lastValue) {
      return {
        fixDescription: t('suggestions.missingComma'),
        autoFix: (input: string) => {
          const lines = input.split('\n');
          const lineIndex = beforePosition.split('\n').length - 1;
          const line = lines[lineIndex];
          if (!line.trim().endsWith(',')) {
            lines[lineIndex] = line + ',';
            return lines.join('\n');
          }
          return input;
        }
      };
    }
  }

  // 检查布尔值大小写
  if (jsonString.match(/\b(TRUE|FALSE)\b/)) {
    return {
      fixDescription: t('suggestions.booleanCase'),
      autoFix: (input: string) => input.replace(/\b(TRUE|FALSE)\b/g, match => match.toLowerCase())
    };
  }

  // 检查 null 大小写
  if (jsonString.match(/\b(NULL)\b/)) {
    return {
      fixDescription: t('suggestions.nullCase'),
      autoFix: (input: string) => input.replace(/\b(NULL)\b/g, 'null')
    };
  }

  // 检查未转义的引号
  if (jsonString.match(/[^\\]"/)) {
    return {
      fixDescription: t('suggestions.unescapedQuote'),
      autoFix: (input: string) => input.replace(/([^\\])"/g, '$1\\"')
    };
  }

  return t('suggestions.checkSyntax');
} 