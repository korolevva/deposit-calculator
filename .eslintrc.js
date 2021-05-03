module.exports = {
    parser: "@typescript-eslint/parser",
    extends: [
        "plugin:react/recommended",
        "plugin:@typescript-eslint/eslint-plugin/recommended",
        "plugin:prettier/recommended",
        "plugin:sonarjs/recommended",
    ],
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2018,
        ecmaFeatures: {
            jsx: true // Allows for the parsing of JSX
        }
    },
    rules: {
        '@typescript-eslint/camelcase': [
            'error',
            { properties: 'never', allow: ['UNSAFE_componentWillMount'] },
        ],
        '@typescript-eslint/no-unused-vars': 2,
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/camelcase': 0,
        '@typescript-eslint/interface-name-prefix': 0,
        'arrow-parens': 0,
        'camelcase': 0,
        'class-methods-use-this': 0,
        'consistent-return': 0,
        'func-names': 0,
        'global-require': 0,
        'jsx-quotes': 0,
        'lines-between-class-members': 0,
        'no-case-declarations': 0,
        'no-console': 0,
        'no-else-return': [2, { allowElseIf: true }],
        'no-empty-function': 0,
        'no-multi-spaces': [2, { exceptions: { ImportDeclaration: true, VariableDeclarator: true } }],
        'no-param-reassign': [2, { props: false }],
        'no-use-before-define': 0,
        'no-useless-constructor': 0,
        'prefer-destructuring': ['error', { object: true, array: false }],
        'react/destructuring-assignment': 0,
        'react/forbid-prop-types': 0,
        'react/jsx-closing-tag-location': 0,
        'react/jsx-curly-spacing': 0,
        'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.tsx'] }],
        'react/jsx-no-target-blank': 0,
        'react/jsx-one-expression-per-line': 0,
        'react/jsx-wrap-multilines': 0,
        'react/no-array-index-key': 0,
        'react/no-did-mount-set-state': 0,
        'react/no-unused-prop-types': 0,
        'react/prop-types': 0,
        'react/sort-comp': 0,
        'space-before-function-paren': ['error', { anonymous: 'never', named: 'never' }],
    },
    settings: {
        react: {
            version: "detect"
        }
    }
};