import React, { useState, useEffect, useRef } from 'react';
import { EditorState, Modifier } from 'draft-js';
import styles from './styles.module.scss';
import Image from 'next/image';
import coloringIcon from '@/assets/icons/ic_coloring.svg';

const colorPalette = [
  { name: 'RED', color: '#FF0000' },
  { name: 'ORANGE', color: '#FFA500' },
  { name: 'YELLOW', color: '#FFFF00' },
  { name: 'GREEN', color: '#008000' },
  { name: 'BLUE', color: '#0000FF' },
  { name: 'PURPLE', color: '#800080' },
  { name: 'BLACK', color: '#000000' },
];

interface ColorPaletteProps {
  editorState: EditorState;
  onEditorChange: (editorState: EditorState) => void;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({
  editorState,
  onEditorChange,
}) => {
  const [showPalette, setShowPalette] = useState(false);
  const paletteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        paletteRef.current &&
        !paletteRef.current.contains(event.target as Node)
      ) {
        setShowPalette(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getCurrentColor = () => {
    const selection = editorState.getSelection();
    const currentStyle = editorState.getCurrentInlineStyle();

    return (
      colorPalette.find((color) => currentStyle.has(color.name))?.name || null
    );
  };

  const handleToggleColor = (colorStyle: string) => {
    const selection = editorState.getSelection();
    let nextContentState = editorState.getCurrentContent();

    // Remove all color styles
    colorPalette.forEach((color) => {
      nextContentState = Modifier.removeInlineStyle(
        nextContentState,
        selection,
        color.name,
      );
    });

    // Apply the selected color style
    const nextEditorState = EditorState.push(
      editorState,
      Modifier.applyInlineStyle(nextContentState, selection, colorStyle),
      'change-inline-style',
    );

    onEditorChange(nextEditorState);
  };

  return (
    <div className={styles['color-palette-container']} ref={paletteRef}>
      <button
        className={styles['color-toggle']}
        onClick={() => setShowPalette(!showPalette)}
      >
        <Image src={coloringIcon} alt="Color" width={24} height={24} />
      </button>
      {showPalette && (
        <div className={styles['color-palette']}>
          {colorPalette.map((color) => (
            <button
              key={color.name}
              onClick={() => handleToggleColor(color.name)}
              className={`${styles['color-button']} ${
                getCurrentColor() === color.name ? styles['active'] : ''
              }`}
              style={{ backgroundColor: color.color }}
            >
              <span
                className={styles['color-dot']}
                style={{ backgroundColor: color.color }}
              ></span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPalette;
export { colorPalette };
