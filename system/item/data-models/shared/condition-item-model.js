import { WoDItemModel } from '../base-item-model.js'

export class ConditionItemModel extends WoDItemModel {
  static defineSchema() {
    const fields = foundry.data.fields

    const schema = super.defineSchema()

    // Whether the effects on the condition are suppressed or not
    schema.suppressed = new fields.BooleanField({ initial: false })

    // Which effects apply to the condition
    schema.effects = new fields.ObjectField()

    return schema
  }
}
