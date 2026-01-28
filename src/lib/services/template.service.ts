/**
 * Replace template variables in a string
 * Supports {{variable_name}} syntax
 */
export function replaceTemplateVariables(
  template: string,
  variables: Record<string, string>
): string {
  let result = template
  for (const [key, value] of Object.entries(variables)) {
    // Support both {{key}} and {{ key }} formats
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
    result = result.replace(regex, value)
  }
  return result
}

/**
 * Extract variable names from template
 */
export function extractTemplateVariables(template: string): string[] {
  const regex = /{{\s*(\w+)\s*}}/g
  const variables: string[] = []
  let match

  while ((match = regex.exec(template)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1])
    }
  }

  return variables
}

/**
 * Validate template has all required variables
 */
export function validateTemplate(
  template: string,
  requiredVariables: string[]
): { valid: boolean; missing: string[] } {
  const found = extractTemplateVariables(template)
  const missing = requiredVariables.filter((v) => !found.includes(v))

  return {
    valid: missing.length === 0,
    missing,
  }
}

