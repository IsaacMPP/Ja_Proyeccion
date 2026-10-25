/** JA: resuelve referencias de versos (1, "3_2", "4-5") a números de base.
 * El motor json-bible recibe números, pero la selección visual conserva subversos.
 */
export function baseVerseNumber(value: string | number): number {
    const match = String(value ?? "").match(/^(\d+)/)
    return match ? Number(match[1]) : NaN
}

export function selectedBaseVerseNumbers(groups: (string | number)[][]): number[] {
    const found = new Set<number>()
    for (const group of groups || []) {
        for (const verse of group || []) {
            const number = baseVerseNumber(verse)
            if (Number.isSafeInteger(number) && number > 0) found.add(number)
        }
    }
    return [...found]
}
