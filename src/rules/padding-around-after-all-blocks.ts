import { getFilename } from "../utils/msc"
import { Config, PaddingType, StatementType, createPaddingRule } from "../utils/padding"

export const RULE_NAME = getFilename(import.meta.url)

export const config: Config[] = [
  {
    paddingType: PaddingType.Always,
    prevStatementType: StatementType.Any,
    nextStatementType: StatementType.AfterAllToken
  },
  {
    paddingType: PaddingType.Always,
    prevStatementType: StatementType.AfterAllToken,
    nextStatementType: StatementType.Any
  }
]
export default createPaddingRule(RULE_NAME, 'Enforce padding around `afterAll` blocks', config)
