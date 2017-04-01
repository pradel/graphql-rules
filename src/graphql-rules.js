/* eslint-disable no-param-reassign, no-restricted-syntax, no-await-in-loop */
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';

export default class GraphqlRules {
  constructor() {
    this.rules = {};
  }

  addRule(rule) {
    if (!isObject(rule)) {
      throw new Error('graphql-rules: addRule the rule passed should be an object');
    }
    if (this.rules[rule.name]) {
      throw new Error(`graphql-rules: rule ${rule.name} already defined`);
    }
    this.rules[rule.name] = {
      resolver: rule.resolver,
    };
  }

  check(obj) {
    if (!isObject(obj)) {
      throw new Error('graphql-rules: check should be an object');
    }
    if (!obj.rules) obj.rules = [];
    if (isString(obj.rules)) obj.rules = [obj.rules];
    return async (_, args, context) => {
      for (const rule of obj.rules) {
        if (!this.rules[rule]) {
          throw new Error(`graphql-rules: unknow rule ${rule}`);
        }
        await this.rules[rule].resolver(_, args, context);
      }
      return obj.resolver(_, args, context);
    };
  }
}
