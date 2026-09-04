import { useEffect, useRef, useState } from "react";
import {
  FaTrash,
  FaBold,
  FaItalic,
  FaUnderline,
  FaLock,
  FaUnlock,
  FaPlus,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaArrowLeft,
  FaPaperPlane,
} from "react-icons/fa";
import { PiRectangleDashedBold } from "react-icons/pi";
import { Rnd } from "react-rnd";
import styled from "styled-components";
import { useTheme } from "../context/Theme";
import { toJpeg } from "html-to-image";
import { v4 as uuidv4 } from "uuid";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useQuote } from "../context/QueotrContext";

const bgColors = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
  "linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)",
  "linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)",
  "linear-gradient(135deg, #48c6ef 0%, #6f86d6 100%)",
  "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
  "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
  "linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)",
  "linear-gradient(135deg, #ebc0fd 0%, #d9ded8 100%)",
  "linear-gradient(135deg, #13547a 0%, #80d0c7 100%)",
  "linear-gradient(135deg, #00c6fb 0%, #005bea 100%)",
  "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)",
  "linear-gradient(135deg, #7f7fd5 0%, #86a8e7 50%, #91eae4 100%)",
  "linear-gradient(135deg, #232526 0%, #414345 100%)",
];

const initialLayers = [
  {
    id: "abc",
    text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit",
    isLocked: false,
    style: {
      fontWeight: "normal",
      fontStyle: "normal",
      textDecoration: "none",
      fontFamily: "Arial",
      fontSize: 16,
      color: "#ffffff",
      backgroundColor: "transparent",
      textAlign: "left",
    },

    state: {
      x: 10,
      y: 10,
      width: 200,
      height: 100,
    },
  },
];

export default function CanvasVibeEditor() {
  const { colors } = useTheme();
  const textareaRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const {
    admin_user,
    token,
    API,
    setUploadClicked,
    setopenSlidWin,
    setActiveIndex,
  } = useQuote();

  const [visible, setVisible] = useState("Public");
  const [category, setCategory] = useState("all");
  const [description, setDescription] = useState("");
  const [postLoading, setPostLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPostPage, setShowPostPage] = useState(false);
  const [canvasBackground, setCanvasBackground] = useState("#940d6d");

  const handleOpenPost = () => {
    setError("");
    setShowPostPage(true);
  };

  const [layers, setLayers] = useState(initialLayers);
  const [activeLayerId, setActiveLayerId] = useState(null);

  const activeLayer =
    layers.find((layer) => layer.id === activeLayerId) ?? null;

  const selectLayer = (layer) => {
    if (!layer) return;
    setActiveLayerId(layer.id);
  };

  // ------------------------------------------------
  // Update Layer
  // ------------------------------------------------

  const updateLayer = (id, changes) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === id
          ? {
              ...layer,
              ...changes,
            }
          : layer,
      ),
    );
  };

  // ------------------------------------------------
  // Add Text Layer
  // ------------------------------------------------

  const addTextLayer = () => {
    const id = uuidv4().replace(/-/g, "").slice(0, 8);

    const newLayer = {
      id,
      text: "New Text",
      isLocked: false,

      style: {
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none",
        fontFamily: "Arial",
        fontSize: 16,
        color: "#ffffff",
        backgroundColor: "transparent",
        textAlign: "center",
      },

      state: {
        x: Math.floor(Math.random() * 200 + 20),
        y: Math.floor(Math.random() * 200 + 20),
        width: Math.floor(Math.random() * 80 + 80),
        height: Math.floor(Math.random() * 60 + 50),
      },
    };

    setLayers((prev) => [...prev, newLayer]);
    setActiveLayerId(id);
  };
  // ------------------------------------------------
  // Lock / Unlock
  // ------------------------------------------------

  const toggleLockActiveLayer = () => {
    if (!activeLayerId) return;

    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === activeLayerId
          ? {
              ...layer,
              isLocked: !layer.isLocked,
            }
          : layer,
      ),
    );
  };

  const inactiavteLayer = () => {
    setActiveLayerId(null);
  };

  // ------------------------------------------------
  // Update Layer State
  // ------------------------------------------------

  const updateLayerState = (id, stateChanges) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === id
          ? {
              ...layer,
              state: {
                ...layer.state,
                ...stateChanges,
              },
            }
          : layer,
      ),
    );
  };

  // ------------------------------------------------
  // Update Active Layer Style
  // ------------------------------------------------

  const updateActiveLayerStyle = (changes) => {
    if (!activeLayerId) return;

    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === activeLayerId
          ? {
              ...layer,
              style: {
                ...layer.style,
                ...changes,
              },
            }
          : layer,
      ),
    );
  };

  // ------------------------------------------------
  // Delete Active Layer
  // ------------------------------------------------

  const deleteActiveLayer = () => {
    if (!activeLayerId) return;

    setLayers((prev) => prev.filter((layer) => layer.id !== activeLayerId));

    setActiveLayerId(null);
  };

  // ------------------------------------------------
  // Change Text
  // ------------------------------------------------

  const changeText = (value) => {
    if (!activeLayerId) return;

    updateLayer(activeLayerId, {
      text: value,
    });
  };

  const base64ToBlob = (base64, contentType = "image/png") => {
    const byteCharacters = atob(base64.split(",")[1]);
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i += 512) {
      const slice = byteCharacters.slice(i, i + 512);

      const byteNumbers = new Array(slice.length);

      for (let j = 0; j < slice.length; j++) {
        byteNumbers[j] = slice.charCodeAt(j);
      }

      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, {
      type: contentType,
    });
  };

  const exportCanvas = async () => {
    if (!canvasRef.current) return null;

    try {
      const dataUrl = await toJpeg(canvasRef.current, {
        pixelRatio: 3,
      });

      return dataUrl;
    } catch (error) {
      console.error("Canvas export failed:", error);
      throw error;
    }
  };

  const uploadCanvas = async () => {
    const dataUrl = await exportCanvas();
    if (!dataUrl) {
      throw new Error("Canvas export returned no image.");
    }

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    if (!cloudName) {
      throw new Error(
        "VITE_CLOUDINARY_CLOUD_NAME is missing. Check your .env file and restart Vite.",
      );
    }

    const imageBlob = base64ToBlob(dataUrl, "image/png");
    const formData = new FormData();

    formData.append("file", imageBlob, "canvas.png");
    formData.append("upload_preset", "page_Image");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
      );

      return response.data.secure_url;
    } catch (error) {
      console.error("Cloudinary status:", error.response?.status);
      console.error("Cloudinary error:", error.response?.data);
      throw error;
    }
  };

  const handlePost = async () => {
    if (!admin_user) {
      const confirmLogin = window.confirm(
        "You have to sign up or login to post",
      );

      if (confirmLogin) {
        navigate("/login");
      }

      return;
    }

    if (!description.trim()) {
      setError("Please write something about your post.");
      return;
    }

    if (!layers.length || !layers.some((layer) => layer.text?.trim())) {
      setError("Please add/write something in the editor.");
      return;
    }

    try {
      setError("");
      setPostLoading(true);
      setActiveLayerId(null);

      const ready_url = await uploadCanvas();

      if (!ready_url) {
        throw new Error("Failed to upload canvas.");
      }

      const response = await axios.post(
        `${API}/api/sentence/post`,
        {
          ready_url,
          text: description,
          mode: visible,
          id: admin_user?._id,
          category,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUploadClicked?.(false);
      setopenSlidWin?.(false);
      setActiveIndex?.(null);

      alert("Uploaded Successfully");

      navigate("/home");
    } catch (error) {
      console.error("Post failed:", error);

      setError(
        error.response?.data?.message || error.message || "Failed to post",
      );
    } finally {
      setPostLoading(false);
    }
  };

  return (
    <EditorContainer
      style={{
        background: colors.bgPage,
        color: colors.textPrimary,
      }}>
      <TopPanel
        activeLayer={activeLayer}
        onDelete={deleteActiveLayer}
        onStyleChange={updateActiveLayerStyle}
        onAddText={addTextLayer}
        onToggleLock={toggleLockActiveLayer}
        onInactive={inactiavteLayer}
        onBack={() => {
          if (confirm("Want to go back...")) {
            setUploadClicked?.(false);
            setopenSlidWin?.(false);
            setActiveIndex?.(null);
            navigate("/home");
          }
        }}
        onPost={handleOpenPost}
        postLoading={postLoading}
      />

      <CanvasArea>
        <Canvas
          ref={canvasRef}
          width={"100%"}
          style={{ background: canvasBackground }}>
          {layers.map((layer) => (
            <TextLayer
              key={layer.id}
              layer={layer}
              isActive={layer.id === activeLayerId}
              onSelect={selectLayer}
              onUpdateState={updateLayerState}
            />
          ))}
        </Canvas>

        <div
          className="bg-colors d-flex gap-2 py-1 overflow-auto"
          style={{
            minHeight: "max-content",
            maxWidth: "350px",
            cursor: "pointer",
            minHeight: "40px",
          }}>
          {bgColors.map((bg, i) => {
            return (
              <>
                <div
                  className="span rounded-5"
                  onClick={() => {
                    setCanvasBackground(bg);
                  }}
                  style={{
                    minWidth: "35px",
                    height: "35px",
                    background: bg,
                  }}
                />
              </>
            );
          })}
        </div>
      </CanvasArea>

      <EditorControls>
        <TextAreaWrapper>
          <Textarea
            ref={textareaRef}
            value={activeLayer?.text ?? ""}
            disabled={!activeLayer || activeLayer.isLocked}
            placeholder="Select a text layer"
            onChange={(e) => changeText(e.target.value)}
          />
        </TextAreaWrapper>
        <ToolButton onClick={handleOpenPost}>
          <FaPaperPlane />
        </ToolButton>
      </EditorControls>

      {showPostPage && (
        <PostPage
          onBack={() => setShowPostPage(false)}
          onPost={handlePost}
          description={description}
          setDescription={setDescription}
          category={category}
          setCategory={setCategory}
          visible={visible}
          setVisible={setVisible}
          error={error}
          postLoading={postLoading}
        />
      )}
    </EditorContainer>
  );
}

function PostPage({
  description,
  setDescription,
  category,
  setCategory,
  visible,
  setVisible,
  error,
  postLoading,
  onBack,
  onPost,
}) {
  return (
    <PostPageContainer>
      <PostHeader className="w-100">
        <ToolButton
          type="button"
          title="Back to editor"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onBack();
          }}>
          <FaArrowLeft size={18} />
        </ToolButton>

        <h2>Create Post</h2>
      </PostHeader>

      <PostForm>
        <FormGroup>
          <label>Description</label>
          <DescriptionInput
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write about your post..."
            disabled={postLoading}
            spellCheck={false}
          />
        </FormGroup>

        <FormGroup>
          <label>Tag / Category</label>

          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter category"
            disabled={postLoading}
            spellCheck={false}
          />
        </FormGroup>

        <FormGroup>
          <label>Visibility</label>

          <VisibilityOptions>
            <VisibilityButton
              type="button"
              active={visible === "Public"}
              disabled={postLoading}
              onClick={() => setVisible("Public")}>
              For Public
            </VisibilityButton>

            <VisibilityButton
              type="button"
              active={visible === "Follower"}
              disabled={postLoading}
              onClick={() => setVisible("Follower")}>
              For Follower
            </VisibilityButton>

            <VisibilityButton
              type="button"
              active={visible === "Paid"}
              disabled={true}
              onClick={() => setVisible("Paid")}>
              Paid Only
            </VisibilityButton>
          </VisibilityOptions>
        </FormGroup>

        {error && <PostError>{error}</PostError>}

        <PostButton type="button" disabled={postLoading} onClick={onPost}>
          {postLoading ? "Posting..." : "Post"}
        </PostButton>
      </PostForm>
    </PostPageContainer>
  );
}

// ==================================================
// TOP PANEL
// ==================================================

function TopPanel({
  activeLayer,
  onDelete,
  onStyleChange,
  onAddText,
  onToggleLock,
  onBack,
  onPost,
  postLoading,
  onInactive,
}) {
  const disabled = !activeLayer;
  const style = activeLayer?.style ?? {};

  return (
    <UpperControl onClick={(e) => e.stopPropagation()}>
      <ToolButton
        type="button"
        title="Back to editor"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onBack();
        }}>
        <FaArrowLeft size={18} />
      </ToolButton>

      <ToolButton onClick={onAddText}>
        <FaPlus size={18} />
      </ToolButton>

      <ToolButton disabled={disabled} onClick={onDelete}>
        <FaTrash />
      </ToolButton>

      <ToolButton type="button" disabled={disabled} onClick={onInactive}>
        <PiRectangleDashedBold size={18} />
      </ToolButton>

      <ToolButton
        disabled={disabled}
        active={activeLayer?.isLocked}
        onClick={onToggleLock}>
        {activeLayer?.isLocked ? <FaLock /> : <FaUnlock />}
      </ToolButton>

      <ToolButton
        disabled={disabled}
        active={style.fontWeight === "bold"}
        onClick={() =>
          onStyleChange({
            fontWeight: style.fontWeight === "bold" ? "normal" : "bold",
          })
        }>
        <FaBold />
      </ToolButton>

      <ToolButton
        disabled={disabled}
        active={style.fontStyle === "italic"}
        onClick={() =>
          onStyleChange({
            fontStyle: style.fontStyle === "italic" ? "normal" : "italic",
          })
        }>
        <FaItalic />
      </ToolButton>

      <ToolButton
        disabled={disabled}
        active={style.textDecoration === "underline"}
        onClick={() =>
          onStyleChange({
            textDecoration:
              style.textDecoration === "underline" ? "none" : "underline",
          })
        }>
        <FaUnderline />
      </ToolButton>

      <ToolButton
        disabled={disabled}
        active={style.textAlign === "left"}
        title="Align Left"
        onClick={() =>
          onStyleChange({
            textAlign: "left",
          })
        }>
        <FaAlignLeft />
      </ToolButton>

      <ToolButton
        disabled={disabled}
        active={style.textAlign === "center"}
        title="Align Center"
        onClick={() =>
          onStyleChange({
            textAlign: "center",
          })
        }>
        <FaAlignCenter />
      </ToolButton>

      <ToolButton
        disabled={disabled}
        active={style.textAlign === "right"}
        title="Align Right"
        onClick={() =>
          onStyleChange({
            textAlign: "right",
          })
        }>
        <FaAlignRight />
      </ToolButton>

      <Select
        disabled={disabled}
        value={style.fontFamily ?? "Arial"}
        onChange={(e) =>
          onStyleChange({
            fontFamily: e.target.value,
          })
        }>
        <option value="Arial">Arial</option>
        <option value="Verdana">Verdana</option>
        <option value="Georgia">Georgia</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Courier New">Courier New</option>
      </Select>

      <Select
        disabled={disabled}
        value={style.fontSize ?? 16}
        onChange={(e) =>
          onStyleChange({
            fontSize: Number(e.target.value),
          })
        }>
        {[8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64].map((size) => (
          <option key={size} value={size}>
            {size}px
          </option>
        ))}
      </Select>

      <ColorInput
        disabled={disabled}
        type="color"
        value={style.color ?? "#ffffff"}
        title="Text Color"
        onChange={(e) =>
          onStyleChange({
            color: e.target.value,
          })
        }
      />

      <ColorInput
        disabled={disabled}
        type="color"
        value={
          style.backgroundColor === "transparent"
            ? "#000000"
            : style.backgroundColor
        }
        title="Background Color"
        onChange={(e) =>
          onStyleChange({
            backgroundColor: e.target.value,
          })
        }
      />

      <ToolButton
        disabled={disabled}
        title="Remove Background"
        onClick={() =>
          onStyleChange({
            backgroundColor: "transparent",
          })
        }>
        ×
      </ToolButton>
    </UpperControl>
  );
}

// ==================================================
// TEXT LAYER
// ==================================================

function TextLayer({ layer, isActive, onSelect, onUpdateState }) {
  const canEdit = isActive && !layer.isLocked;

  return (
    <Rnd
      bounds="parent"
      className="text-layer"
      size={{
        width: layer.state.width,
        height: layer.state.height,
      }}
      position={{
        x: layer.state.x,
        y: layer.state.y,
      }}
      enableResizing={canEdit}
      disableDragging={!canEdit}
      style={{
        border: "1px dashed",
        borderColor: isActive ? "var(--accent-color)" : "#0000",
      }}
      onPointerDown={() => onSelect(layer)}
      onDragStop={(e, data) => {
        onUpdateState(layer.id, {
          x: data.x,
          y: data.y,
        });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        onUpdateState(layer.id, {
          x: position.x,
          y: position.y,
          width: ref.offsetWidth,
          height: ref.offsetHeight,
        });
      }}>
      <LayerContent
        style={{
          fontWeight: layer.style?.fontWeight ?? "normal",
          fontStyle: layer.style?.fontStyle ?? "normal",
          textDecoration: layer.style?.textDecoration ?? "none",
          fontFamily: layer.style?.fontFamily ?? "Arial",
          fontSize: `${layer.style?.fontSize ?? 16}px`,
          color: layer.style?.color ?? "#ffffff",
          backgroundColor: layer.style?.backgroundColor ?? "transparent",
          textAlign: layer.style?.textAlign ?? "left",
        }}>
        {layer.text}
      </LayerContent>

      {canEdit && <ResizeHandles />}
    </Rnd>
  );
}

// ==================================================
// RESIZE HANDLES
// ==================================================

function ResizeHandles() {
  return (
    <>
      <Handle className="top-left" />
      <Handle className="top" />
      <Handle className="top-right" />

      <Handle className="left" />
      <Handle className="right" />

      <Handle className="bottom-left" />
      <Handle className="bottom" />
      <Handle className="bottom-right" />
    </>
  );
}

// ==================================================
// STYLES
// ==================================================

const EditorContainer = styled.div`
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

const UpperControl = styled.div`
  flex-shrink: 0;

  min-height: 50px;

  padding: 16px;

  box-sizing: border-box;

  display: flex;
  align-items: center;
  gap: 8px;

  border-bottom: 1px solid var(--border-color);

  background: var(--bg-surface);

  overflow-x: auto;
  overflow-y: hidden;

  scrollbar-width: none;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

const ColorInput = styled.input`
  flex-shrink: 0;

  width: 34px;
  height: 34px;

  padding: 2px;

  border: 1px solid var(--border-color);
  border-radius: 3px;

  background: var(--bg-card);

  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const CanvasArea = styled.div`
  flex: 1;
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
`;

const Canvas = styled.div`
  position: relative;

  flex-shrink: 0;

  width: ${(props) => props.width};
  max-width: 350px;

  aspect-ratio: 19/20;

  box-sizing: border-box;

  // border: 2px solid var(--accent-color);

  padding: 4px;

  background: #5c0965;

  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 1px;
    background: var(--border-subtle);
    transform: translateX(-50%);
    pointer-events: none;
    z-index: 1;
  }

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 1px;
    background: var(--border-subtle);
    transform: translateY(-50%);
    pointer-events: none;
    z-index: 1;
  }
`;

const EditorControls = styled.div`
  flex-shrink: 0;

  min-height: 80px;

  padding: 8px;

  box-sizing: border-box;

  display: flex;

  align-items: center;

  gap: 8px;

  border-top: 1px solid var(--border-color);

  background: var(--bg-surface);
`;

const ToolButton = styled.button`
  flex-shrink: 0;

  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid;
  border-radius: 3px;
  background: none;
  border-color: ${(p) => (p.active ? "var(--accent-color)" : "var(--bg-card)")};

  color: ${(p) => (p.active ? "var(--text-primary)" : "var(--text-primary)")};

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

const Select = styled.select`
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

const TextAreaWrapper = styled.div`
  flex: 1;

  min-width: 0;

  box-sizing: border-box;
`;

const Textarea = styled.textarea`
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

const Handle = styled.div`
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

const LayerContent = styled.div`
  width: 100%;
  height: 100%;

  overflow: hidden;

  user-select: none;

  word-break: break-word;

  box-sizing: border-box;
`;

const PostPageContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 16px;
  background: var(--bg-page);
  color: var(--text-primary);
`;

const PostHeader = styled.div`
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

const PostForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 500px;
  margin: auto;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 14px;
    color: var(--text-secondary);
  }
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-surface);
  color: var(--text-primary);
  outline: none;
`;

const DescriptionInput = styled.textarea`
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

const VisibilityOptions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const VisibilityButton = styled.button`
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

const PostError = styled.div`
  color: #ff4d4f;
  font-size: 14px;
`;

const PostButton = styled.button`
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
