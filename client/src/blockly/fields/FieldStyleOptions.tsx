import * as Blockly from 'blockly';

import { StyleSchema } from '../../models/style.ts';

import { createRoot } from 'react-dom/client';
import StyleOptionsPane from '../../components/StyleOptionsPane.tsx';

/**
 * Custom Blockly field for storing and editing the Style block's options
 */
export class FieldStyleOptions extends Blockly.FieldImage {
  private style: StyleSchema | null = null;

  constructor(src: string | typeof Blockly.Field.SKIP_SETUP, width: string | number, height: string | number, alt?: string, onClick?: (p1: Blockly.FieldImage) => void, flipRtl?: boolean, config?: Blockly.FieldImageConfig) {
    super(src, width, height, alt, onClick, flipRtl, config);
    this.SERIALIZABLE = true;
    this.setOnClickHandler(this.onClick);
    this.setTooltip("Click to modify this style");
  }

  public setStyle(style: StyleSchema) {
    this.style = style;
  }

  public getStyle(): StyleSchema | null {
    return this.style;
  }

  /**
   * Handler for click action
   */
  private onClick = (p1: Blockly.FieldImage) => {
    this.showEditor_();
  }

  /**
   * Override showEditor_ to show custom UI for editing style options
   * @param event Optional mouse event that triggered the editor to open (we don't use this since we call it programmatically)
   */
  protected showEditor_(event?: Event) {
    const editorDiv = this.dropdownCreate_();
    Blockly.DropDownDiv.getContentDiv().appendChild(editorDiv);
    Blockly.DropDownDiv.showPositionedByField(this, this.dropdownDispose_.bind(this));
  }

  /**
   * Create the dropdown editor UI
   * @return The HTML element for the dropdown editor
   */
  dropdownCreate_(): HTMLElement {
    const editorDiv = document.createElement('editor-div');
    const editorRoot = createRoot(editorDiv);

    const render = (style: StyleSchema) => {
      editorRoot.render(
        <StyleOptionsPane 
          robotStyle={style} 
          onChange={(newStyle: StyleSchema) => {
            this.setStyle(newStyle);
            render(newStyle);
          }}
        />
      );
    }

    if (this.style) {
      render(this.style);
    } else {
      // fallback to a default placeholder if none is set
      const placeholderStyle: StyleSchema = {
        nodding: {
          enabled: false,
          frequency: 50,
          intensity: 50,
          direction: "up_down"
        },
        utterances: {
          enabled: false,
          utterance_frequency: 50,
          utterance_volume: 50,
          utterance_list: []
        },
        gaze: {
          enabled: false,
          eye_contact: 50,
          shift_gaze: 50
        }
      }
      render(placeholderStyle);
    }

    return editorDiv;
  }

  /**
   * Dispose of the dropdown editor
   */
  dropdownDispose_() {
    // HTML cleanup is handled automaticcally, and we don't have any event listeners to clean up (yet)
  }

  /**
   * Override fromJson
   * @param options The JSON data defining the field.
   */
  static fromJson(options: any) {
    const value = Blockly.utils.parsing.replaceMessageReferences(options.src);
    return new FieldStyleOptions(
      value,
      options.width,
      options.height,
      options.alt,
      undefined,
      options.flipRtl,
      options
    );
  }

  /**
   * Serialization methods
   */
  saveState(): any {
    return {
      'style': this.getStyle(),
    };
  }

  loadState(state: any) {
    if (!this.getStyle()) {
      this.setStyle(state['style']);
    }
  }
}