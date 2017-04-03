# graphql-rules

A little utility allowing you to write rules for your graphql resolvers.

```javascript
// By default return a new GraphqlRules instance
import graphqlRules from 'graphql-rules';

graphqlRules.addRule({
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

graphqlRules.addRule({
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
    users: graphqlRules.check({
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
    addSomeDbObject: graphqlRules.check({
      // Check the user is logged
      rules: 'is-logged',
      resolver: (obj, args, context) => {
        return MyModel.insert(context.obj);
      },
    }),
  },
};

// You can also import the class directly and create more instances
import { GraphqlRules } from 'graphql-rules';

// All users rules
const userRules = new GraphqlRules();
userRules.addRule();

// All posts rules
const postRules = new GraphqlRules();
postRules.addRule();
```
