/* eslint-disable max-lines */
export const SCHEMA = {
  type: 'object',
  properties: {
    dynamicVars: {
      type: 'object',
      properties: {
        requiredArgs: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        validArgs: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        pagesize: {
          type: 'integer',
        },
      },
    },
    arguments: {
      type: 'object',
      required: {
        $data: '/dynamicVars/requiredArgs',
      },
      propertyNames: {
        enum: {
          $data: '/dynamicVars/validArgs',
        },
      },
      additionalProperties: false,
      properties: {
        after: {
          type: 'string',
        },
        before: {
          type: 'string',
        },
        cascade: {
          type: 'string',
        },
        data: {},
        dryrun: {
          type: 'boolean',
        },
        filter: {
          type: ['object', 'array'],
          if: {
            type: 'array',
          },
          // eslint-disable-next-line unicorn/no-thenable
          then: {
            items: {
              type: 'object',
            },
          },
        },
        id: {
          type: 'string',
        },
        order: {
          type: 'string',
        },
        page: {
          type: 'integer',
          minimum: 1,
        },
        pagesize: {
          type: 'integer',
          minimum: 1,
          maximum: {
            $data: '/dynamicVars/pagesize',
          },
        },
        params: {
          type: 'object',
        },
        populate: {
          type: 'string',
        },
        rename: {
          type: 'string',
        },
        select: {
          type: 'string',
        },
        silent: {
          type: 'boolean',
        },
      },
    },
  },
  allOf: [
    {
      if: {
        properties: {
          dynamicVars: {
            properties: {
              multiple: {
                const: true,
              },
            },
          },
        },
      },
      // eslint-disable-next-line unicorn/no-thenable
      then: {
        properties: {
          data: {
            type: 'array',
            items: {
              type: 'object',
            },
          },
        },
      },
      else: {
        properties: {
          data: {
            type: 'object',
          },
        },
      },
    },
  ],
}
/* eslint-enable max-lines */
