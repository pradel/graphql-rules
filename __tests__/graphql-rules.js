import GraphqlRules from '../src/graphql-rules';

describe('graphql-rules', () => {
  test('should return a class', () => {
    const graphqlRules = new GraphqlRules();
    expect(graphqlRules instanceof GraphqlRules).toBeTruthy();
  });

  describe('#addRule', () => {
    const graphqlRules = new GraphqlRules();

    test('should take an object', () => {
      try {
        graphqlRules.addRule('rule');
        throw new Error();
      } catch (err) {
        expect(err.message).toBe('graphql-rules: addRule the rule passed should be an object');
      }
    });

    test('should add a rule', () => {
      graphqlRules.addRule({
        name: 'is-admin',
      });
      expect(graphqlRules.rules['is-admin']).toBeTruthy();
    });

    test('should throw when rule is already defined', () => {
      try {
        graphqlRules.addRule({
          name: 'is-admin',
        });
        throw new Error();
      } catch (err) {
        expect(err.message).toBe('graphql-rules: rule is-admin already defined');
      }
    });
  });

  describe('#check', () => {
    const graphqlRules = new GraphqlRules();

    test('should take an object', () => {
      try {
        graphqlRules.check('rule');
        throw new Error();
      } catch (err) {
        expect(err.message).toBe('graphql-rules: check should be an object');
      }
    });

    test('should throw on unknow rules', async () => {
      try {
        const func = graphqlRules.check({
          rules: 'is-admin',
        });
        await func();
        throw new Error();
      } catch (err) {
        expect(err.message).toBe('graphql-rules: unknow rule is-admin');
      }
    });

    test('should execute rule', async () => {
      const ruleResolver = jest.fn();
      graphqlRules.addRule({
        name: 'is-logged',
        resolver: ruleResolver,
      });
      const resolver = jest.fn();
      const func = graphqlRules.check({ rules: 'is-logged', resolver });
      await func('a', 'b', 'c');
      expect(ruleResolver.mock.calls.length).toBe(1);
      expect(ruleResolver.mock.calls[0]).toEqual(['a', 'b', 'c']);
      expect(resolver.mock.calls.length).toBe(1);
      expect(resolver.mock.calls[0]).toEqual(['a', 'b', 'c']);
    });

    test('should call resolver', async () => {
      const resolver = jest.fn();
      const func = graphqlRules.check({ resolver });
      await func('a', 'b', 'c');
      expect(resolver.mock.calls.length).toBe(1);
      expect(resolver.mock.calls[0]).toEqual(['a', 'b', 'c']);
    });
  });
});
