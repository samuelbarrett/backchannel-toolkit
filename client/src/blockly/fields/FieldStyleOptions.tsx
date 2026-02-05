import * as Blockly from 'blockly';

import { StyleSchema } from '../../models/style.ts';

import { createRoot } from 'react-dom/client';
import StyleOptionsPane from '../../components/StyleOptionsPane.tsx';

/**
 * Custom Blockly field for storing and editing the Style block's options
 */
export class FieldStyleOptions extends Blockly.FieldImage {
  private style: StyleSchema | null = null;
  private detachResizeHandler?: () => void;

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
    const contentDiv = Blockly.DropDownDiv.getContentDiv() as HTMLElement;

    const applySizing = () => {
      const margin = 80;
      const anchor = this.getSvgRoot()?.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const availableBelow = anchor ? viewportHeight - anchor.bottom - margin : viewportHeight - margin;
      const availableAbove = anchor ? anchor.top - margin : viewportHeight - margin;
      const maxHeight = Math.max(240, Math.max(availableBelow, availableAbove));

      const widthValue = getComputedStyle(document.documentElement).getPropertyValue('--style-pane-width').trim() || '500px';
      const containerDiv = contentDiv.parentElement as HTMLElement | null;
      const targetDiv = containerDiv ?? contentDiv;

      targetDiv.style.width = widthValue;
      targetDiv.style.maxWidth = '90vw';
      contentDiv.style.width = '100%';
      contentDiv.style.maxWidth = '100%';
      contentDiv.style.maxHeight = `${Math.max(240, Math.min(maxHeight, viewportHeight - margin))}px`;
      contentDiv.style.overflowY = 'auto';
      contentDiv.classList.add('style-options-drop-down');
    };

    const refreshLayout = () => {
      applySizing();
      if (Blockly.DropDownDiv.isVisible()) {
        Blockly.DropDownDiv.repositionForWindowResize();
        this.alignArrowToField();
      }
    };

    applySizing();

    contentDiv.appendChild(editorDiv);
    Blockly.DropDownDiv.showPositionedByField(this, this.dropdownDispose_.bind(this));
    refreshLayout();
    this.detachResizeHandler = this.attachResizeHandler(refreshLayout);
    requestAnimationFrame(refreshLayout);
  }

  /**
   * Create the dropdown editor UI
   * @return The HTML element for the dropdown editor
   */
  dropdownCreate_(): HTMLElement {
    const editorDiv = document.createElement('div');
    editorDiv.className = 'style-options-root';
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
    const contentDiv = Blockly.DropDownDiv.getContentDiv() as HTMLElement;
    const containerDiv = contentDiv.parentElement as HTMLElement | null;
    contentDiv.style.maxHeight = '';
    contentDiv.style.maxWidth = '';
    contentDiv.style.overflowY = '';
    contentDiv.classList.remove('style-options-drop-down');
    if (containerDiv) {
      containerDiv.style.width = '';
      containerDiv.style.maxWidth = '';
    }

    if (this.detachResizeHandler) {
      this.detachResizeHandler();
      this.detachResizeHandler = undefined;
    }
  }

  /** Attach a resize listener so the dropdown adapts to viewport changes. */
  private attachResizeHandler(onResize: () => void): () => void {
    const handler = () => onResize();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }

  /** Align the dropdown arrow horizontally to the field trigger. */
  private alignArrowToField() {
    const dropdownDiv = document.querySelector('.blocklyDropDownDiv') as HTMLElement | null;
    const arrow = dropdownDiv?.querySelector('.blocklyDropDownArrow') as HTMLElement | null;
    const anchorRect = this.getSvgRoot()?.getBoundingClientRect();

    if (!dropdownDiv || !arrow || !anchorRect) {
      return;
    }

    const dropdownRect = dropdownDiv.getBoundingClientRect();
    const arrowSize = (Blockly.DropDownDiv as unknown as { ARROW_SIZE?: number }).ARROW_SIZE ?? 16;
    const padding = (Blockly.DropDownDiv as unknown as { ARROW_HORIZONTAL_PADDING?: number }).ARROW_HORIZONTAL_PADDING ?? 12;
    const anchorCenterX = anchorRect.left + anchorRect.width / 2;
    const unclampedX = anchorCenterX - dropdownRect.left - arrowSize / 2;
    const clampedX = this.clamp(unclampedX, padding, dropdownRect.width - padding - arrowSize);

    const transform = arrow.style.transform || window.getComputedStyle(arrow).transform || '';
    const translateMatch = transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
    const matrixMatch = transform.match(/matrix\([^,]+,[^,]+,[^,]+,[^,]+,[-\d.]+,([-\d.]+)\)/);
    const translateY = translateMatch ? Number(translateMatch[2]) || 0 : matrixMatch ? Number(matrixMatch[1]) || 0 : 0;

    arrow.style.transform = `translate(${clampedX}px, ${translateY}px) rotate(45deg)`;
  }

  private clamp(value: number, min: number, max: number) {
    if (max < min) {
      return min;
    }
    return Math.min(Math.max(value, min), max);
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