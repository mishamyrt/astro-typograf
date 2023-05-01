import { dim } from 'kleur/colors'

export function formatTimeStat (timeStart: number, timeEnd: number): string {
  const buildTime = timeEnd - timeStart
  return buildTime < 750
    ? `${Math.round(buildTime)}ms`
    : `${(buildTime / 1000).toFixed(2)}s`
}

export function reportResults (count: number, timeStart: number, timeEnd: number): void {
  const filePlural = count === 1 ? 'file' : 'files'
  const message = `Improved ${count} ${filePlural} in ${formatTimeStat(timeStart, timeEnd)}.`
  process.stdout.write(dim(message))
  process.stdout.write('\n\n')
}
