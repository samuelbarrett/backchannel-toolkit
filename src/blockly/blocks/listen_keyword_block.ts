
export const listenKeywordBlockJson = [{
  "type": "listen_keyword_block",
  "tooltip": "The robot listens to the person until they finish speaking.",
  "helpUrl": "",
  "message0": "Listen for keyword: %1 %2 Style: %3",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "keyword",
      "options": [
        [
          "option",
          "OPTIONNAME"
        ],
        [
          "option",
          "OPTIONNAME"
        ],
        [
          "option",
          "OPTIONNAME"
        ],
        [
          "option",
          "OPTIONNAME"
        ]
      ]
    },
    {
      "type": "input_dummy",
      "name": "title"
    },
    {
      "type": "input_value",
      "name": "style",
      "align": "RIGHT"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 0,
  "inputsInline": false
}];