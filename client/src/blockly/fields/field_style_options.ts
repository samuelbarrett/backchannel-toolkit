import * as Blockly from 'blockly';
import { Style } from 'src/models/style';

/**
 * Custom Blockly field for storing and editing the Style block's options
 */
export class FieldStyleOptions extends Blockly.FieldImage {
  private style: Style | null = null;

  constructor(src: string | typeof Blockly.Field.SKIP_SETUP, width: string | number, height: string | number, alt?: string, onClick?: (p1: Blockly.FieldImage) => void, flipRtl?: boolean, config?: Blockly.FieldImageConfig) {
    super(src, width, height, alt, onClick, flipRtl, config);
    this.SERIALIZABLE = true;
  }

  public setStyle(style: Style) {
    this.style = style;
  }

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
}