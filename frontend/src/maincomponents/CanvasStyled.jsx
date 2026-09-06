import styled from "styled-components";

export const EditorContainer = styled.div`
  width: 100%;
  height: 100dvh;
  max-height: 100dvh;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;

  overflow: hidden;

  position: relative;
  z-index: 910011;

  background: var(--bg-page);
  color: var(--text-primary);

  .bg-colors {
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }
`;

export const UpperControl = styled.div`
  height: min-content;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-surface);
`;

export const UpperControlLeft = styled.div`
  flex-shrink: 0;

  min-height: 40px;

  padding: 8px;

  box-sizing: border-box;

  display: flex;
  align-items: center;
  gap: 5px;

  overflow-x: auto;
  overflow-y: hidden;

  scrollbar-width: none;

  .uploadButton input {
    display: none;
  }

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

export const BottomControl = styled.div`
  // max-width: 600px;
  overflow: auto;
  // max-height: 240px;
`;

export const ColorInput = styled.input`
  background: var(--bg-card);
  cursor: pointer;
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const CanvasArea = styled.div`
  min-height: 0;
  gap: 5px;
  width: 100%;
  overflow: auto;

  display: flex;
  flex-direction: column;

  // justify-content: center;
  align-items: center;

  padding: 12px;

  box-sizing: border-box;

  background: var(--bg-page);
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

export const Canvas = styled.div`
  position: relative;

  flex-shrink: 0;

  width: ${(props) => props.width};
  max-width: 300px;

  aspect-ratio: 1;

  box-sizing: border-box;

  // border: 2px solid var(--accent-color);

  padding: 4px;

  background: #5c0965;

  overflow: hidden;
`;

export const EditorControls = styled.div`
  min-height: 80px;
  height: 100%;
  padding: 8px;

  box-sizing: border-box;

  display: flex;

  align-items: center;

  gap: 8px;

  border-top: 1px solid var(--border-color);

  background: var(--bg-surface);
`;

export const ToolButton = styled.button`
  flex-shrink: 0;

  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  border-radius: 3px;
  background: none;
  color: ${(p) => (p.active ? "var(--accent-color)" : "var(--text-primary)")};

  cursor: pointer;

  transition: 0.15s ease;

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const Select = styled.select`
  flex-shrink: 0;

  height: 34px;
  min-width: 80px;

  padding: 0 8px;

  border: 1px solid var(--border-color);
  border-radius: 3px;

  background: var(--bg-card);
  color: var(--text-primary);

  outline: none;

  &:focus {
    border-color: var(--accent-color);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  option {
    background: var(--bg-card);
    color: var(--text-primary);
  }
`;

export const TextAreaWrapper = styled.div`
  flex: 1;

  min-width: 0;

  box-sizing: border-box;
`;

export const Textarea = styled.textarea`
  width: 100%;
  height: 100%;

  box-sizing: border-box;

  resize: none;

  padding: 7px;

  border: 1px solid var(--border-color);

  border-radius: 3px;

  outline: none;

  background: var(--bg-card);

  color: var(--text-primary);

  font-family: inherit;

  &::placeholder {
    color: var(--text-muted);
  }

  &:focus {
    border-color: var(--accent-color);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Handle = styled.div`
  position: absolute;

  width: 8px;
  height: 8px;

  box-sizing: border-box;

  background: var(--text-primary);

  border: 1px solid var(--border-color);

  z-index: 10;

  pointer-events: none;

  &.top-left {
    top: -5px;
    left: -5px;
  }

  &.top {
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
  }

  &.top-right {
    top: -5px;
    right: -5px;
  }

  &.left {
    left: -5px;
    top: 50%;
    transform: translateY(-50%);
  }

  &.right {
    right: -5px;
    top: 50%;
    transform: translateY(-50%);
  }

  &.bottom-left {
    bottom: -5px;
    left: -5px;
  }

  &.bottom {
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
  }

  &.bottom-right {
    bottom: -5px;
    right: -5px;
  }
`;

export const LayerContent = styled.div`
  width: 100%;
  height: 100%;

  overflow: hidden;

  user-select: none;

  word-break: break-word;

  box-sizing: border-box;
`;

export const PostPageContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 16px;
  background: var(--bg-page);
  color: var(--text-primary);
`;

export const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;

  button {
    border: none;
    background: transparent;
    color: var(--text-primary);
    font-size: 24px;
    cursor: pointer;
  }

  h2 {
    margin: 0;
    font-size: 20px;
  }
`;

export const PostForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 500px;
  margin: auto;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 14px;
    color: var(--text-secondary);
  }
`;

export const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-surface);
  color: var(--text-primary);
  outline: none;
`;

export const DescriptionInput = styled.textarea`
  width: 100%;
  min-height: 120px;
  box-sizing: border-box;
  padding: 12px;
  resize: vertical;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-surface);
  color: var(--text-primary);
  outline: none;
`;

export const VisibilityOptions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const VisibilityButton = styled.button`
  padding: 9px 14px;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  background: ${(p) =>
    p.active ? "var(--accent-color)" : "var(--bg-surface)"};
  color: var(--text-primary);
  cursor: pointer;
  opacity: ${(p) => (p.disabled ? 0.5 : 1)};

  &:disabled {
    cursor: not-allowed;
  }
`;

export const PostError = styled.div`
  color: #ff4d4f;
  font-size: 14px;
`;

export const PostButton = styled.button`
  width: 100%;
  padding: 13px;
  border: none;
  border-radius: 8px;
  background: var(--accent-color);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
`;
