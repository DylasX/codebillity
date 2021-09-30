export const createUser = {
  status: 201,
  description: 'User created',
  schema: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        description: 'Http Code',
        default: 201,
        example: 201,
      },
      message: {
        type: 'string',
        description: 'Response Message',
        default: 'User created',
        example: 'User created',
      },
      data: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'User name',
            default: 'John',
            example: 'John',
          },
          lastName: {
            type: 'string',
            description: 'User lastname',
            default: 'Doe',
            example: 'Doe',
          },
          email: {
            type: 'string',
            description: 'user Email',
            default: 'JohnDo111e@hotmail.com',
            example: 'JohnDo111e@hotmail.com',
          },
        },
      },
    },
  },
};

export const getAllUsers = {
  status: 200,
  description: 'User created',
  schema: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        description: 'Http Code',
        default: 200,
        example: 200,
      },
      message: {
        type: 'string',
        description: 'Response Message',
        default: 'User retrieved',
        example: 'User retrieved',
      },
      data: {
        type: 'array',
        items: {
          properties: {
            id: {
              type: 'number',
              description: 'User id',
              default: 200,
              example: 200,
            },
            name: {
              type: 'string',
              description: 'User name',
              default: 'John',
              example: 'John',
            },
            lastName: {
              type: 'string',
              description: 'User lastname',
              default: 'Doe',
              example: 'Doe',
            },
            email: {
              type: 'string',
              description: 'user Email',
              default: 'JohnDo111e@hotmail.com',
              example: 'JohnDo111e@hotmail.com',
            },
            phone: {
              type: 'string',
              description: 'user phone',
              default: '30303030303',
              example: '30303030303',
            },
            createdAt: {
              type: 'string',
              description: 'user created',
              default: '2021-09-21T10:50:52.344Z',
              example: '2021-09-21T10:50:52.344Z',
            },
            updatedAt: {
              type: 'string',
              description: 'user updated',
              default: '2021-09-21T10:50:52.344Z',
              example: '2021-09-21T10:50:52.344Z',
            },
          },
        },
      },
    },
  },
};
