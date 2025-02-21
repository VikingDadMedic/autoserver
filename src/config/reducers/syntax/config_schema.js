/* eslint-disable max-lines */
export const SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'config_json_schema_v1',
  title: "autoserver configuration's JSON schema",
  description: "JSON schema validating the autoserver's configuration",
  type: 'object',
  required: ['engine', 'collections'],
  properties: {
    engine: {
      type: 'integer',
      minimum: 0,
    },
    name: {
      type: 'string',
    },
    env: {
      type: 'string',
      enum: ['dev', 'production'],
    },
    collections: {
      additionalProperties: {
        $ref: '#/definitions/collection',
      },
      propertyNames: {
        $ref: '#/definitions/validClientCollname',
      },
    },
    params: {
      $ref: '#/definitions/params',
    },
    plugins: {
      $ref: '#/definitions/plugins',
    },
    authorize: {
      $ref: '#/definitions/authorize',
    },
    validation: {
      $ref: '#/definitions/validation',
    },
    operators: {
      $ref: '#/definitions/patchOperators',
    },
    log: {
      $ref: '#/definitions/log',
    },
    protocols: {
      type: 'object',
    },
    databases: {
      type: 'object',
    },
    limits: {
      $ref: '#/definitions/limits',
    },
    collTypes: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    customValidationNames: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
  additionalProperties: false,
  patternProperties: {
    '^\\$': true,
  },
  definitions: {
    collection: {
      type: 'object',
      additionalProperties: false,
      patternProperties: {
        '^\\$': true,
      },
      required: ['attributes'],
      properties: {
        name: {
          $ref: '#/definitions/validClientCollnames',
        },
        description: {
          $ref: '#/definitions/description',
        },
        authorize: {
          $ref: '#/definitions/authorize',
        },
        database: {
          $ref: '#/definitions/database',
        },
        attributes: {
          type: 'object',
          additionalProperties: {
            $ref: '#/definitions/attribute',
          },
          propertyNames: {
            $ref: '#/definitions/validAttributeName',
          },
          properties: {
            id: {
              $ref: '#/definitions/idAttribute',
            },
          },
          maxProperties: 50,
        },
      },
    },
    idAttribute: {
      properties: {
        type: {
          const: 'string',
        },
        validate: {
          properties: {
            required: {
              not: {
                const: false,
              },
            },
          },
        },
      },
      allOf: [
        {
          not: {
            required: ['value'],
          },
        },
        {
          not: {
            required: ['readonly'],
          },
        },
      ],
    },
    attribute: {
      type: 'object',
      additionalProperties: false,
      patternProperties: {
        '^\\$': true,
      },
      properties: {
        alias: {
          oneOf: [
            {
              type: 'string',
              $ref: '#/definitions/validAttributeName',
            },
            {
              type: 'array',
              items: {
                type: 'string',
                $ref: '#/definitions/validAttributeName',
              },
            },
          ],
        },
        readonly: {
          $ref: '#/definitions/configFuncBoolean',
        },
        value: {
          $ref: '#/definitions/transformValue',
        },
        validate: {
          $ref: '#/definitions/validate',
        },
        type: {
          $ref: '#/definitions/type',
        },
        multiple: {
          type: 'boolean',
        },
        deprecation_reason: {
          $ref: '#/definitions/description',
        },
        description: {
          $ref: '#/definitions/description',
        },
        examples: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        default: {
          $ref: '#/definitions/configFuncOrValue',
        },
      },
    },
    authorize: {
      oneOf: [
        {
          type: 'array',
          items: {
            type: 'object',
          },
        },
        {
          type: 'object',
        },
      ],
    },
    database: {
      type: 'string',
    },
    params: {
      type: 'object',
      propertyNames: {
        $ref: '#/definitions/validUserName',
      },
    },
    plugins: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          plugin: {
            typeof: ['function', 'string'],
          },
          enabled: {
            type: 'boolean',
          },
          opts: {
            type: 'object',
            propertyNames: {
              $ref: '#/definitions/validName',
            },
          },
        },
        additionalProperties: false,
      },
    },
    validation: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        properties: {
          test: {
            $ref: '#/definitions/configFuncString',
          },
          message: {
            $ref: '#/definitions/configFuncString',
            if: {
              type: 'string',
            },
            // eslint-disable-next-line unicorn/no-thenable
            then: {
              anyOf: [
                {
                  pattern: '^must\\s',
                },
                {
                  pattern: '^\\("must\\s.*"\\)$',
                },
                {
                  pattern: "^\\('must\\s.*'\\)$",
                },
                {
                  pattern: '^\\(`must\\s.*`\\)$',
                },
              ],
            },
          },
          type: {
            $ref: '#/definitions/jsonSchemaType',
          },
        },
        additionalProperties: false,
      },
      propertyNames: {
        $ref: '#/definitions/validUserName',
      },
    },
    patchOperators: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        required: ['apply'],
        properties: {
          apply: {
            $ref: '#/definitions/configFuncOrValue',
          },
          check: {
            $ref: '#/definitions/configFuncOrValue',
          },
          attribute: {
            type: 'array',
            minLength: 1,
            uniqueItems: true,
            oneOf: [
              {
                items: {
                  enum: ['boolean', 'integer', 'number', 'string', 'any'],
                },
              },
              {
                items: {
                  enum: [
                    'boolean[]',
                    'integer[]',
                    'number[]',
                    'string[]',
                    'any[]',
                  ],
                },
              },
            ],
          },
          argument: {
            type: 'array',
            minLength: 1,
            uniqueItems: true,
            items: {
              enum: [
                'boolean',
                'integer',
                'number',
                'string',
                'any',
                'object',
                'empty',
                'boolean[]',
                'integer[]',
                'number[]',
                'string[]',
                'any[]',
                'object[]',
                'empty[]',
              ],
            },
          },
        },
        additionalProperties: false,
      },
      propertyNames: {
        $ref: '#/definitions/validUserOpName',
      },
    },
    log: {
      oneOf: [
        {
          $ref: '#/definitions/logAdapter',
        },
        {
          type: 'array',
          items: {
            $ref: '#/definitions/logAdapter',
          },
        },
      ],
    },
    logAdapter: {
      type: 'object',
      properties: {
        provider: {
          type: 'string',
        },
        opts: {
          type: 'object',
        },
        level: {
          type: 'string',
          enum: ['silent', 'info', 'log', 'warn', 'error'],
        },
      },
      additionalProperties: false,
    },
    limits: {
      type: 'object',
      properties: {
        pagesize: {
          type: 'integer',
          minimum: 0,
        },
        maxmodels: {
          type: 'integer',
        },
        maxpayload: {
          oneOf: [
            {
              type: 'string',
            },
            {
              type: 'integer',
            },
          ],
        },
      },
      additionalProperties: false,
    },
    type: {
      oneOf: [
        {
          $ref: '#/definitions/singleType',
        },
        {
          type: 'array',
          oneOf: [
            {
              items: {
                $ref: '#/definitions/nonCollSimpleType',
              },
            },
            {
              items: {
                $ref: '#/definitions/nonCollMultipleType',
              },
            },
          ],
          minItems: 1,
          uniqueItems: true,
        },
      ],
    },
    singleType: {
      type: 'string',
      oneOf: [
        {
          $ref: '#/definitions/collType',
        },
        {
          $ref: '#/definitions/nonCollType',
        },
      ],
    },
    collType: {
      enum: {
        $data: '/collTypes',
      },
    },
    nonCollType: {
      oneOf: [
        {
          $ref: '#/definitions/nonCollSimpleType',
        },
        {
          $ref: '#/definitions/nonCollMultipleType',
        },
      ],
    },
    nonCollSimpleType: {
      enum: ['string', 'number', 'integer', 'boolean'],
    },
    nonCollMultipleType: {
      enum: ['string[]', 'number[]', 'integer[]', 'boolean[]'],
    },
    transformValue: {
      $ref: '#/definitions/configFuncOrValue',
    },
    description: {
      type: 'string',
    },
    configFuncOrValue: {
      anyOf: [
        {
          $ref: '#/definitions/configFunc',
        },
        {
          not: {
            $ref: '#/definitions/configFunc',
          },
        },
      ],
    },
    configFuncString: {
      anyOf: [
        {
          $ref: '#/definitions/configFunc',
        },
        {
          not: {
            $ref: '#/definitions/configFunc',
          },
          type: 'string',
        },
      ],
    },
    configFuncBoolean: {
      anyOf: [
        {
          $ref: '#/definitions/configFunc',
        },
        {
          type: 'boolean',
        },
      ],
    },
    configFunc: {
      anyOf: [
        {
          typeof: 'function',
        },
        {
          type: 'string',
          pattern: '^\\s*\\(.*\\)\\s*$',
        },
      ],
    },
    validName: {
      type: 'string',
      pattern: '^[a-z][_0-9a-z]*$',
    },
    validUserName: {
      type: 'string',
      pattern: '^\\$[a-z][_0-9a-z]*$',
    },
    validUserOpName: {
      type: 'string',
      pattern: '^__[a-z][_0-9a-z]*$',
    },
    validClientCollnames: {
      oneOf: [
        {
          type: 'array',
          items: {
            $ref: '#/definitions/validClientCollname',
          },
        },
        {
          $ref: '#/definitions/validClientCollname',
        },
      ],
    },
    validClientCollname: {
      allOf: [
        {
          $ref: '#/definitions/validName',
        },
        {
          maxLength: 100,
        },
      ],
    },
    validAttributeName: {
      allOf: [
        {
          $ref: '#/definitions/validName',
        },
        {
          maxLength: 100,
        },
        {
          not: {
            const: 'all',
          },
        },
      ],
    },
    validate: {
      type: 'object',
      $ref: '#/definitions/jsonSchema',
    },
    jsonSchemaType: {
      oneOf: [
        {
          type: 'string',
          enum: [
            'string',
            'number',
            'integer',
            'boolean',
            'empty',
            'object',
            'array',
          ],
        },
        {
          type: 'array',
          items: {
            $ref: '#/definitions/jsonSchemaType',
          },
        },
      ],
    },
    jsonSchema: {
      definitions: {
        jsonSchemaArray: {
          type: 'array',
          minItems: 1,
          items: {
            $ref: '#/definitions/jsonSchema',
          },
        },
        nonNegativeInteger: {
          type: 'integer',
          minimum: 0,
        },
        // eslint-disable-next-line id-length
        nonNegativeIntegerDefault0: {
          allOf: [
            {
              $ref: '#/definitions/jsonSchema/definitions/nonNegativeInteger',
            },
            {
              default: 0,
            },
          ],
        },
        stringArray: {
          type: 'array',
          items: {
            type: 'string',
          },
          uniqueItems: true,
          default: [],
        },
      },
      type: ['object', 'boolean'],
      properties: {
        multipleOf: {
          type: 'number',
          exclusiveMinimum: 0,
        },
        maximum: {
          type: 'number',
        },
        exclusiveMaximum: {
          type: 'number',
        },
        minimum: {
          type: 'number',
        },
        exclusiveMinimum: {
          type: 'number',
        },
        maxLength: {
          $ref: '#/definitions/jsonSchema/definitions/nonNegativeInteger',
        },
        minLength: {
          $ref: '#/definitions/jsonSchema/definitions/nonNegativeIntegerDefault0',
        },
        pattern: {
          type: 'string',
          format: 'regex',
        },
        additionalItems: {
          $ref: '#/definitions/jsonSchema',
        },
        items: {
          anyOf: [
            {
              $ref: '#/definitions/jsonSchema',
            },
            {
              $ref: '#/definitions/jsonSchema/definitions/jsonSchemaArray',
            },
          ],
          default: {},
        },
        maxItems: {
          $ref: '#/definitions/jsonSchema/definitions/nonNegativeInteger',
        },
        minItems: {
          $ref: '#/definitions/jsonSchema/definitions/nonNegativeIntegerDefault0',
        },
        uniqueItems: {
          type: 'boolean',
          default: false,
        },
        contains: {
          $ref: '#/definitions/jsonSchema',
        },
        const: true,
        enum: {
          type: 'array',
          items: true,
          minItems: 1,
          uniqueItems: true,
        },
        if: {
          $ref: '#/definitions/jsonSchema',
        },
        // eslint-disable-next-line unicorn/no-thenable
        then: {
          $ref: '#/definitions/jsonSchema',
        },
        else: {
          $ref: '#/definitions/jsonSchema',
        },
        allOf: {
          $ref: '#/definitions/jsonSchema/definitions/jsonSchemaArray',
        },
        anyOf: {
          $ref: '#/definitions/jsonSchema/definitions/jsonSchemaArray',
        },
        oneOf: {
          $ref: '#/definitions/jsonSchema/definitions/jsonSchemaArray',
        },
        not: {
          $ref: '#/definitions/jsonSchema',
        },
        required: {
          type: 'boolean',
        },
        dependencies: {
          anyOf: [
            {
              $ref: '#/definitions/jsonSchema',
            },
            {
              $ref: '#/definitions/jsonSchema/definitions/stringArray',
            },
          ],
        },
        format: {
          type: 'string',
          enum: [
            'regex',
            'date-time',
            'date',
            'time',
            'email',
            'hostname',
            'ipv4',
            'ipv6',
            'uri',
            'uri-reference',
            'uri-template',
            'json-pointer',
            'relative-json-pointer',
          ],
        },
      },
      default: true,
      propertyNames: {
        oneOf: [
          {
            enum: {
              $data: '/customValidationNames',
            },
          },
          {
            enum: [
              'multipleOf',
              'maximum',
              'exclusiveMaximum',
              'minimum',
              'exclusiveMinimum',
              'maxLength',
              'minLength',
              'pattern',
              'format',
              'additionalItems',
              'items',
              'maxItems',
              'minItems',
              'uniqueItems',
              'contains',
              'const',
              'enum',
              'required',
              'dependencies',
              'if',
              'then',
              'else',
              'allOf',
              'anyOf',
              'oneOf',
              'not',
            ],
          },
        ],
      },
    },
  },
}
/* eslint-enable max-lines */
