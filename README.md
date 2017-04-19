# graphql-rules

A little utility allowing you to write rules for your graphql resolvers.

```javascript
import GraphqlRules from 'graphql-rules';

// All users rules
const userRules = new GraphqlRules();

userRules.addRule({
  // Name of the rule
  name: 'is-logged',
  // Function called when the rule is required
  resolver: (obj, args, context) => {
    // your logic here
    if (!context.userId) {
      throw new Error('Forbidden');
    }
  },
});

userRules.addRule({
  // Name of the rule
  name: 'is-admin',
  // Function called when the rule is required
  resolver: (obj, args, context) => {
    // your logic here
    if (!context.user.isAdmin()) {
      throw new Error('Forbidden');
    }
  },
});

// Your resolver object
const resolverMap = {
  Query: {
    // Your graphql query resolver
    users: userRules.check({
      // Define your required rules
      rules: ['is-admin', 'other-rules', 'is-logged'],
      // Define your resolver
      // The rules need to pass before the resolver is executed
      resolver: (obj, args, context) => {
        return context.Users.find();
      },
    }),
  },
  Mutation: {
    addSomeDbObject: userRules.check({
      // Check the user is logged
      rules: 'is-logged',
      resolver: (obj, args, context) => {
        return MyModel.insert(context.obj);
      },
    }),
  },
};
```
