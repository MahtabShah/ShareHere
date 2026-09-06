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

import { AiOutlineDelete } from "react-icons/ai";

import { MdLockOpen, MdLockOutline } from "react-icons/md";
import { RiImageAddFill } from "react-icons/ri";
import { TbPhotoCancel } from "react-icons/tb";

import { FaTextHeight } from "react-icons/fa";
import { RxFontFamily } from "react-icons/rx";
import { IoColorFill } from "react-icons/io5";
import { AiTwotoneEdit } from "react-icons/ai";
import { LuArrowRightLeft } from "react-icons/lu";
import { BsArrowsMove } from "react-icons/bs";
import { RxDimensions } from "react-icons/rx";
import { PiRectangleDashedBold, PiX } from "react-icons/pi";
import { LuArrowUpDown } from "react-icons/lu";
import { RiInputField } from "react-icons/ri";
import { RiFocusMode } from "react-icons/ri";

import { Rnd } from "react-rnd";
import styled from "styled-components";
import { useTheme } from "../context/Theme";
import { toJpeg } from "html-to-image";
import { v4 as uuidv4 } from "uuid";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useQuote } from "../context/QueotrContext";
const initBorder = "1px solid var(--border-color)";

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
  const [debugLogs, setDebugLogs] = useState([]);

  const log = (...args) => {
    console.log(...args);

    setDebugLogs((prev) => [
      ...prev,
      ...args.map((arg) => {
        if (typeof arg === "object" && arg !== null) {
          try {
            return JSON.stringify(arg, null, 2);
          } catch {
            return String(arg);
          }
        }

        return String(arg);
      }),
    ]);
  };
  const [layers, setLayers] = useState(initialLayers);

  /*
   * IMPORTANT:
   * Only keep activeLayerId.
   * Do NOT keep activeLayer separately in state.
   */
  const [activeLayerId, setActiveLayerId] = useState(null);

  /*
   * Always derive activeLayer from latest layers.
   *
   * This is the main fix for the "one step behind" problem.
   */
  const activeLayer =
    layers.find((layer) => layer.id === activeLayerId) ?? null;

  /* --------------------------------------------------
     SELECT LAYER
  -------------------------------------------------- */

  const selectLayer = (layer) => {
    if (!layer) return;

    setActiveLayerId(layer.id);
  };

  /* --------------------------------------------------
     UPDATE LAYER
  -------------------------------------------------- */

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

  /* --------------------------------------------------
     UPDATE LAYER STATE
  -------------------------------------------------- */

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

  /* --------------------------------------------------
     ADD TEXT LAYER
  -------------------------------------------------- */

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

  /* --------------------------------------------------
     LOCK / UNLOCK
  -------------------------------------------------- */

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

  /* --------------------------------------------------
     INACTIVE
  -------------------------------------------------- */

  const inactiavteLayer = () => {
    setActiveLayerId(null);
  };

  /* --------------------------------------------------
     UPDATE ACTIVE LAYER STYLE
  -------------------------------------------------- */

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

  /* --------------------------------------------------
     DELETE ACTIVE LAYER
  -------------------------------------------------- */

  const deleteActiveLayer = () => {
    if (!activeLayerId) return;

    setLayers((prev) => prev.filter((layer) => layer.id !== activeLayerId));

    setActiveLayerId(null);
  };

  /* --------------------------------------------------
     CHANGE TEXT
  -------------------------------------------------- */

  const changeText = (value) => {
    if (!activeLayerId) return;

    updateLayer(activeLayerId, {
      text: value,
    });
  };

  const handleOpenPost = () => {
    setError("");
    setShowPostPage(true);
  };

  /* --------------------------------------------------
     BASE64 TO BLOB
  -------------------------------------------------- */
  /* --------------------------------------------------
   DATA URL → BLOB
-------------------------------------------------- */

  const dataUrlToBlob = async (dataUrl) => {
    if (!dataUrl || typeof dataUrl !== "string") {
      throw new Error("Invalid image data.");
    }

    try {
      const response = await fetch(dataUrl);

      if (!response.ok) {
        throw new Error("Failed to convert image to Blob.");
      }

      return await response.blob();
    } catch (err) {
      throw new Error(err?.message || "Failed to create image Blob.");
    }
  };

  /* --------------------------------------------------
   EXPORT CANVAS
-------------------------------------------------- */

  const exportCanvas = async () => {
    if (!canvasRef?.current) {
      throw new Error("Canvas element not found.");
    }
    log({ "3...48": "....348" });

    try {
      const dataUrl = await toJpeg(canvasRef.current, {
        pixelRatio: 1,
        quality: 0.9,
      });

      log({ "data Url": dataUrl });

      if (!dataUrl) {
        throw new Error("Canvas export returned empty data.");
      }

      return dataUrl;
    } catch (err) {
      log({ "data Url export": dataUrl });

      throw new Error(err?.message || "Canvas export failed.");
    }
  };

  /* --------------------------------------------------
   UPLOAD CANVAS
-------------------------------------------------- */

  const uploadCanvas = async () => {
    try {
      // 1. Export canvas
      const dataUrl = await exportCanvas();
      log({ "Dta url 373": dataUrl });

      if (!dataUrl) {
        throw new Error("Canvas export returned no image.");
      }

      // 2. Cloudinary configuration
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

      if (!cloudName) {
        throw new Error("VITE_CLOUDINARY_CLOUD_NAME is missing.");
      }

      // 3. Convert Data URL → Blob
      const imageBlob = await dataUrlToBlob(dataUrl);

      if (!imageBlob || imageBlob.size === 0) {
        throw new Error("Image Blob is empty.");
      }

      // 4. FormData
      const formData = new FormData();

      formData.append("file", imageBlob, "canvas.jpg");

      formData.append("upload_preset", "page_Image");

      // 5. Upload
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
      );

      // 6. Validate response
      const secureUrl = response?.data?.secure_url;

      if (!secureUrl) {
        throw new Error("Cloudinary did not return an image URL.");
      }

      return secureUrl;
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      log({ "UPLOAD ERROR:": err?.message || "Image upload failed." });

      // Axios error
      if (err?.response) {
        console.error("Cloudinary/API status:", err.response.status);

        console.error("Cloudinary/API data:", err.response.data);
      }

      throw new Error(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Image upload failed.",
      );
    }
  };

  /* --------------------------------------------------
   POST
-------------------------------------------------- */

  const handlePost = async (e) => {
    // Login check
    if (!admin_user) {
      const confirmLogin = window.confirm(
        "You have to sign up or login to post",
      );

      if (confirmLogin) {
        navigate("/login");
      }

      return;
    }

    // Description validation
    if (!description?.trim()) {
      setError("Please write something about your post.");
      return;
    }

    // Layer validation
    if (!layers?.length || !layers.some((layer) => layer.text?.trim())) {
      setError("Please add/write something in the editor.");
      return;
    }

    try {
      setError("");
      setPostLoading(true);
      setActiveLayerId(null);

      // Upload image
      const ready_url = await uploadCanvas();
      log({ "ready_url ERROR:": ready_url });

      if (!ready_url) {
        throw new Error("Failed to upload canvas.");
      }

      // Create post
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

      log({ "response ERROR:": response });

      // Success
      setUploadClicked?.(false);
      setopenSlidWin?.(false);
      setActiveIndex?.(null);

      alert("Uploaded Successfully");

      navigate("/home");
    } catch (err) {
      console.error("POST ERROR:", err);

      log({ "err ERROR:": response });

      const message =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to post.";

      setError(message);
      alert(message);
    } finally {
      setPostLoading(false);
    }
  };
  /* --------------------------------------------------
     UI
  -------------------------------------------------- */
  const [photoUrl, setPhotoUrl] = useState(null);

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
        photoUrl={photoUrl}
        setPhotoUrl={setPhotoUrl}
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
          style={{
            backgroundImage: `url(${photoUrl})`,
            background: photoUrl ?? canvasBackground,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}>
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
      </CanvasArea>

      <BottomPanel
        refr={textareaRef}
        changeText={changeText}
        activeLayer={activeLayer}
        activeLayerId={activeLayerId}
        updateLayerState={updateLayerState}
        canvasBackground={canvasBackground}
        setCanvasBackground={setCanvasBackground}
        onDelete={deleteActiveLayer}
        onStyleChange={updateActiveLayerStyle}
        onAddText={addTextLayer}
        onToggleLock={toggleLockActiveLayer}
        onInactive={inactiavteLayer}
        onPost={handleOpenPost}
        postLoading={postLoading}
      />

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
          debugLogs={debugLogs}
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
  debugLogs,
}) {
  return (
    <PostPageContainer className="overflow-auto">
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

      <div
        style={{
          top: "100px",
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: "200px",
          overflow: "auto",
          background: "black",
          color: "lime",
          zIndex: 999999,
          fontSize: "12px",
          padding: "10px",
          color: "#f2f0f0",
        }}>
        Error is:
        {debugLogs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>

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

function AddBackgroundImg({ setPhotoUrl, photoUrl }) {
  function getPhotoUrl(file) {
    if (!file || !file.type.startsWith("image/")) {
      return null;
    }

    return URL.createObjectURL(file);
  }

  const handleFile = (e) => {
    const file = e.target.files[0];

    const url = getPhotoUrl(file);
    setPhotoUrl(url);
    console.log(url);
  };

  return (
    <>
      {photoUrl ? (
        <TbPhotoCancel size={18} onClick={() => setPhotoUrl(null)} />
      ) : (
        <label className="uploadButton">
          <RiImageAddFill size={18} />
          <input type="file" accept="image/*" onChange={handleFile} />
        </label>
      )}
    </>
  );
}

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
      onPointerDown={(e) => {
        e.stopPropagation();
        onSelect(layer);
      }}
      /*
       * LIVE DRAG
       *
       * Not onDragStop.
       */
      onDrag={(e, data) => {
        onUpdateState(layer.id, {
          x: data.x,
          y: data.y,
        });
      }}
      /*
       * LIVE RESIZE
       *
       * Not onResizeStop.
       */
      onResize={(e, direction, ref, delta, position) => {
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
          placeContent: "center",
          whiteSpace: "break-spaces",
        }}>
        {layer.text}
      </LayerContent>

      {canEdit && <ResizeHandles />}
    </Rnd>
  );
}

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
  photoUrl,
  setPhotoUrl,
}) {
  const disabled = !activeLayer;
  const style = activeLayer?.style ?? {};

  const tools = [
    {
      title: "Add Text",
      element: FaPlus,
      onClick: onAddText,
      enable: true,
      size: 16,
    },
    {
      title: "Delete",
      element: AiOutlineDelete,
      onClick: onDelete,
    },

    {
      title: activeLayer?.isLocked ? "Unlock" : "Lock",
      element: activeLayer?.isLocked ? MdLockOutline : MdLockOpen,
      active: activeLayer?.isLocked,
      onClick: onToggleLock,
    },
  ];

  return (
    <UpperControl
      className="d-flex gap-2 px-2 overflow-auto align-items-center "
      onClick={(e) => e.stopPropagation()}>
      <ToolButton
        type="button"
        title={"Back to editor"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onBack();
        }}>
        {<FaArrowLeft size={18} />}
      </ToolButton>

      <UpperControlLeft className="d-flex gap-3 overflow-auto justify-content-center flex-grow-1 align-items-center ">
        <ToolButton
          className="pb-1 rounded-5"
          style={{
            border: "1px solid var(--border-color)",
          }}>
          <AddBackgroundImg photoUrl={photoUrl} setPhotoUrl={setPhotoUrl} />
        </ToolButton>

        {tools.map((tool, index) => (
          <ToolButton
            key={index}
            type="button"
            title={tool.title}
            disabled={!tool.enable && disabled}
            className="rounded-5"
            style={{
              border: "1px solid var(--border-color)",
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              tool.onClick?.();
            }}>
            {
              <tool.element
                size={tool.size || 18}
                color={tool.active && "var(--accent-color"}
              />
            }
          </ToolButton>
        ))}

        <ToolButton
          className="rounded-5 overflow-hidden"
          style={{
            border: "1px solid var(--border-color)",
          }}>
          <ColorInput
            className="rounded-5"
            disabled={disabled}
            type="color"
            value={style.color ?? "#ffffff"}
            title="Text Color"
            style={{ width: "30px", height: "30px" }}
            onChange={(e) =>
              onStyleChange({
                color: e.target.value,
              })
            }
          />
        </ToolButton>
      </UpperControlLeft>

      <ToolButton
        style={{ placeSelf: "center", cursor: "pointer" }}
        onClick={onPost}>
        <FaPaperPlane size={16} />
      </ToolButton>
    </UpperControl>
  );
}

function BottomPanel({
  activeLayer,
  activeLayerId,
  updateLayerState,
  changeText,
  refr,
  setCanvasBackground,
  canvasBackground,
  onDelete,
  onStyleChange,
  onAddText,
  onToggleLock,
  onPost,
  postLoading,
  onInactive,
}) {
  const [window, setWindow] = useState("home");

  const disabled = !activeLayer;
  const style = activeLayer?.style ?? {};

  const tools = {
    binary: [
      {
        onClick: () => setWindow("EditText"),
        element: AiTwotoneEdit,
        size: 20,
      },

      {
        title: "Inactive",
        element: RiFocusMode,
        onClick: onInactive,
        size: 20,
      },
      {
        title: "Bold",
        leftBorder: true,

        element: FaBold,
        active: style.fontWeight === "bold",
        onClick: () =>
          onStyleChange({
            fontWeight: style.fontWeight === "bold" ? "normal" : "bold",
          }),
      },
      {
        title: "Italic",
        element: FaItalic,
        active: style.fontStyle === "italic",
        onClick: () =>
          onStyleChange({
            fontStyle: style.fontStyle === "italic" ? "normal" : "italic",
          }),
      },
      {
        title: "Underline",
        element: FaUnderline,
        active: style.textDecoration === "underline",
        size: 15,
        onClick: () =>
          onStyleChange({
            textDecoration:
              style.textDecoration === "underline" ? "none" : "underline",
          }),
      },
      {
        title: "Align Left",
        element: FaAlignLeft,
        active: style.textAlign === "left",
        onClick: () =>
          onStyleChange({
            textAlign: "left",
          }),
      },
      {
        title: "Align Center",
        element: FaAlignCenter,
        active: style.textAlign === "center",
        onClick: () =>
          onStyleChange({
            textAlign: "center",
          }),
      },
      {
        title: "Align Right",
        element: FaAlignRight,
        active: style.textAlign === "right",
        onClick: () =>
          onStyleChange({
            textAlign: "right",
          }),
      },
    ],

    multiple: [
      {
        title: "Fill Color",
        enabled: true,
        element: IoColorFill,
        onClick: () => setWindow("FillColor"),
        size: 19,
      },
      {
        onClick: () => setWindow("FontFamily"),
        element: RxFontFamily,
        title: "Font",
        size: 18,
      },
      {
        element: FaTextHeight,
        title: "FontSize",
        onClick: () => setWindow("FontSize"),
        size: 18,
      },
      {
        title: "Adjust",
        onClick: () => setWindow("RndState"),
        element: BsArrowsMove,
        size: 17,
      },
    ],
  };

  const onBack = () => setWindow("home");

  const WrapToolButton = ({ tool, index }) => {
    return (
      <>
        {tool?.leftBorder && (
          <div
            style={{
              borderLeft: tool?.leftBorder && "1px solid var(--border-color)",
            }}
          />
        )}

        <ToolButton
          key={index}
          type="button"
          title={tool.title}
          disabled={!tool.enabled && disabled}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            tool.onClick?.();
          }}>
          {
            <tool.element
              size={tool.size || 16}
              color={tool.active && "var(--accent-color"}
            />
          }
        </ToolButton>
      </>
    );
  };

  return (
    <BottomControl
      className="d-flex flex-column w-100 flex-grow-1 p"
      style={{
        margin: "auto",
        border: "1px solid  var(--border-color)",
        background: `var(--bg-surface)`,
      }}>
      {window === "home" && (
        <div className="d-flex flex-column gap-2 overflow-auto">
          <div
            className="d-flex gap-2 p-2 overflow-auto justify-content-c enter"
            style={{
              borderBottom: "1px solid var(--border-color)",
            }}>
            {tools.binary.map((tool, index) => (
              <WrapToolButton tool={tool} index={index} />
            ))}
          </div>

          <div
            className="d-fle x gap-2 flex-wrap px-2"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
              gap: "10px",
              maxWidth: "600px",
            }}>
            {tools.multiple.map((tool, index) => (
              <div
                className="p-1 px-3 flex-grow-1 rounded d-flex flex-column"
                style={{
                  alignItems: "center",
                  border: "1px solid var(--border-color)",
                }}
                onClick={(e) => {
                  if (!disabled || tool.enabled) {
                    e.preventDefault();
                    e.stopPropagation();
                    tool.onClick?.();
                  }
                }}>
                <WrapToolButton tool={tool} index={index} />
                <span
                  style={{
                    color:
                      !tool.enabled && disabled
                        ? "var(--border-color)"
                        : "var(--text-muted)",
                  }}>
                  {tool.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {window === "RndState" && (
        <RndStateControll
          activeLayer={activeLayer}
          activeLayerId={activeLayerId}
          updateLayerState={updateLayerState}
          onBack={onBack}
        />
      )}

      {window === "EditText" && (
        <div className="d-flex flex-column flex-grow-1 overflow-auto gap">
          <div className="d-flex p-2">
            <ToolButton onClick={onBack}>
              <FaArrowLeft size={18} />
            </ToolButton>
          </div>

          <EditorControls>
            <TextAreaWrapper className="h-100">
              <Textarea
                ref={refr}
                value={activeLayer?.text ?? ""}
                disabled={!activeLayer || activeLayer.isLocked}
                placeholder="Select a text layer"
                onChange={(e) => changeText(e.target.value)}
              />
            </TextAreaWrapper>
          </EditorControls>
        </div>
      )}

      {window === "FillColor" && (
        <CabvasBackground
          onBack={onBack}
          setCanvasBackground={setCanvasBackground}
          canvasBackground={canvasBackground}
        />
      )}

      {window === "FontFamily" && (
        <FontFamilyPanel
          onStyleChange={onStyleChange}
          activeLayer={activeLayer}
          onBack={onBack}
        />
      )}

      {window == "FontSize" && (
        <>
          <FontSizePanel
            onStyleChange={onStyleChange}
            activeLayer={activeLayer}
            onBack={onBack}
          />
        </>
      )}
    </BottomControl>
  );
}

function RndStateControll({
  activeLayer,
  activeLayerId,
  updateLayerState,
  onBack,
}) {
  const mapVariabl = {
    position: ["x", "y"],
    dimension: ["width", "height"],
  };

  const [state, setState] = useState("dimension");

  /*
   * input | swap
   */
  const [controlMode, setControlMode] = useState("swap");

  /*
   * Swap is UI-only.
   *
   * It DOES NOT swap x/y values.
   */
  const [swapState, setSwapState] = useState({
    position: false,
    dimension: false,
  });

  const touchStart = useRef(null);

  const disabled = !activeLayer;

  const variables = mapVariabl[state];

  /*
   * Only change visual order.
   *
   * Example:
   *
   * false -> [x, y]
   * true  -> [y, x]
   *
   * But activeLayer.state.x and activeLayer.state.y
   * NEVER change because of swap.
   */
  const displayedVariables = swapState[state]
    ? [...variables].reverse()
    : variables;

  const firstVariable = displayedVariables[0];
  const secondVariable = displayedVariables[1];

  /* --------------------------------------------------
     UPDATE VALUE
  -------------------------------------------------- */

  const updateValue = (key, value) => {
    if (!activeLayerId) return;

    const number = Number(value);

    updateLayerState(activeLayerId, {
      [key]: state === "dimension" ? Math.max(1, number || 1) : number || 0,
    });
  };

  /* --------------------------------------------------
     MOVE
  -------------------------------------------------- */

  const moveBy = (delta, key) => {
    if (!activeLayerId || !key) return;

    const currentValue = Number(activeLayer.state[key]) || 0;

    const nextValue =
      state === "dimension"
        ? Math.max(1, currentValue + delta)
        : currentValue + delta;

    updateLayerState(activeLayerId, {
      [key]: nextValue,
    });
  };

  /* --------------------------------------------------
     TOUCH START
  -------------------------------------------------- */

  const handlePointerDown = (e) => {
    if (disabled) return;

    if (e.pointerType !== "touch") return;

    touchStart.current = {
      x: e.clientX,
      y: e.clientY,
    };

    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  /* --------------------------------------------------
     TOUCH MOVE
  -------------------------------------------------- */

  const handlePointerMove = (e) => {
    if (disabled) return;

    if (e.pointerType !== "touch") return;

    if (!touchStart.current) return;

    const dx = e.clientX - touchStart.current.x;

    const dy = e.clientY - touchStart.current.y;

    touchStart.current = {
      x: e.clientX,
      y: e.clientY,
    };

    const key = e.currentTarget.getAttribute("data-key");

    const index = Number(e.currentTarget.getAttribute("data-index"));

    if (!key) return;

    /*
     * First section:
     * horizontal movement
     *
     * Second section:
     * vertical movement
     */
    if (index === 0) {
      moveBy(dx, key);
    } else {
      moveBy(dy, key);
    }
  };

  /* --------------------------------------------------
     TOUCH END
  -------------------------------------------------- */

  const handlePointerUp = (e) => {
    touchStart.current = null;

    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {}
  };

  /* --------------------------------------------------
     WHEEL
  -------------------------------------------------- */

  const handleWheel = (e) => {
    if (disabled) return;

    e.preventDefault();

    const key = e.currentTarget.getAttribute("data-key");

    const index = Number(e.currentTarget.getAttribute("data-index"));

    if (!key) return;

    if (index === 0) {
      moveBy(-e.deltaX, key);
    } else {
      moveBy(-e.deltaY, key);
    }
  };

  /* --------------------------------------------------
     SWAP
  -------------------------------------------------- */

  const toggleSwap = () => {
    setSwapState((prev) => ({
      ...prev,
      [state]: !prev[state],
    }));
  };

  /* --------------------------------------------------
     CONTROL BUTTON
  -------------------------------------------------- */

  const ControlButton = ({ mode, children, title }) => {
    return (
      <ToolButton
        type="button"
        disabled={disabled}
        active={controlMode === mode}
        title={title}
        onClick={() => setControlMode(mode)}>
        {children}
      </ToolButton>
    );
  };

  /* --------------------------------------------------
     INPUT MODE
  -------------------------------------------------- */

  const renderInputMode = () => {
    return (
      <div className="d-flex gap-2 w-100">
        {/* FIRST */}

        <div className="flex-grow-1">
          <Textarea
            itemType="Number"
            rows={1}
            disabled={disabled}
            value={activeLayer ? activeLayer.state[firstVariable] : ""}
            onChange={(e) => updateValue(firstVariable, e.target.value)}
          />
        </div>

        {/* SECOND */}

        <div className="flex-grow-1">
          <Textarea
            itemType="Number"
            rows={1}
            disabled={disabled}
            value={activeLayer ? activeLayer.state[secondVariable] : ""}
            onChange={(e) => updateValue(secondVariable, e.target.value)}
          />
        </div>
      </div>
    );
  };

  /* --------------------------------------------------
     SWAP / MOVE MODE
  -------------------------------------------------- */

  const renderSwapMode = () => {
    const renderMoveSection = (key, index) => {
      return (
        <div
          data-key={key}
          data-index={index}
          className="w-100 d-flex align-items-center justify-content-center"
          style={{
            minWidth: 0,
            touchAction: "none",
            userSelect: "none",
          }}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}>
          <div
            className="text-center w-100"
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "#6d888ba8",
            }}>
            {/* {Math.floor(Number(activeLayer?.state[key]) || 0)} */}
            {index == 0 ? <LuArrowRightLeft /> : <LuArrowUpDown />}
          </div>
        </div>
      );
    };

    return (
      <div
        className="w-100 h-100 d-flex flex-column"
        style={{
          minHeight: "100px",
        }}>
        {/* MOVE AREA */}

        <div className="d-flex flex-grow-1">
          {renderMoveSection(firstVariable, 0)}
          <div
            style={{
              marginBlock: "20px",
              borderRight: "1px dashed var(--border-color)",
            }}
          />
          {renderMoveSection(secondVariable, 1)}
        </div>
      </div>
    );
  };

  /* --------------------------------------------------
     MAIN
  -------------------------------------------------- */

  return (
    <>
      {/* TOP BAR */}

      <div
        className="w-100 d-flex gap-2 p-2"
        aria-disabled={disabled}
        style={{
          borderBottom: "1px solid var(--border-color)",
        }}>
        {/* BACK */}

        <ToolButton onClick={onBack}>
          <FaArrowLeft />
        </ToolButton>

        {/* POSITION */}

        <ToolButton
          disabled={disabled}
          active={state === "position"}
          title="Position"
          onClick={() => setState("position")}>
          <BsArrowsMove />
        </ToolButton>

        {/* DIMENSION */}

        <ToolButton
          disabled={disabled}
          active={state === "dimension"}
          title="Dimension"
          onClick={() => setState("dimension")}>
          <RxDimensions />
        </ToolButton>

        {/* DIVIDER */}

        <div
          style={{
            borderRight: "1px solid var(--border-color)",
          }}
        />

        {/* INPUT */}

        <ControlButton mode="input" title="Input">
          <RiInputField size={18} />
        </ControlButton>

        {/* MOVE / SWAP */}

        <ControlButton mode="swap" title="Move / Swap">
          <LuArrowRightLeft size={18} />
        </ControlButton>

        <div
          style={{
            borderRight: "1px solid var(--border-color)",
          }}
        />

        <div className="d-flex gap-3 flex-grow-1">
          <div
            className="flex-grow-1 w-50 d-flex flex-column justify-content-center text-center"
            style={{
              fontSize: "10px",
              opacity: 0.5,
            }}>
            <span>{firstVariable.toUpperCase()}</span>

            <span>
              {Math.floor(
                Number(
                  activeLayer?.state[state == "position" ? "x" : "width"],
                ) || 0,
              )}
            </span>
          </div>

          <div
            className="flex-grow-1 w-50 text-center  flex-column d-flex justify-content-center "
            style={{
              fontSize: "10px",
              opacity: 0.5,
            }}>
            <span>{secondVariable.toUpperCase()}</span>
            <span>
              {Math.floor(
                Number(
                  activeLayer?.state[state == "position" ? "y" : "height"],
                ) || 0,
              )}
            </span>
          </div>
        </div>
      </div>

      {/* CONTENT */}

      <div className="d-flex flex-column rounded position-relative flex-grow-1 w-100 overflow-hidden">
        {/* LABELS */}

        {/* INPUT */}

        {controlMode === "input" && (
          <div className="d-flex flex-grow-1 align-items-center p-2">
            {renderInputMode()}
          </div>
        )}

        {/* MOVE */}

        {controlMode === "swap" && (
          <div className="d-flex flex-grow-1">{renderSwapMode()}</div>
        )}
      </div>
    </>
  );
}

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

function CabvasBackground({ setCanvasBackground, onBack, canvasBackground }) {
  return (
    <>
      <div
        className="bg-colors  w-100 d-flex flex-wrap gap-2 p-2 overflow-auto"
        style={{
          maxWidth: "600px",
          cursor: "pointer",
          minHeight: "40px",
        }}>
        <ToolButton
          className="rounded-5"
          onClick={onBack}
          style={{
            border: initBorder,
          }}>
          <FaArrowLeft />
        </ToolButton>

        {bgColors.map((bg, i) => (
          <ToolButton
            active={bg == canvasBackground}
            key={i}
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
        ))}
      </div>
    </>
  );
}

function FontFamilyPanel({ onBack, onStyleChange, activeLayer }) {
  const FontFamlies = [
    "Arial",
    "Helvetica",
    "Verdana",
    "Tahoma",
    "Trebuchet MS",
    "Times New Roman",
    "Georgia",
    "Garamond",
    "Courier New",
    "Lucida Console",
    "Impact",
    "Comic Sans MS",
    "Arial Black",
    "Segoe UI",
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Poppins",
    "Raleway",
    "Oswald",
    "Merriweather",
    "Playfair Display",
    "Nunito",
    "Ubuntu",
  ];
  return (
    <div
      className="d-flex gap-2 p-2 flex-wrap"
      style={{
        maxHeight: "200px",
      }}>
      <ToolButton
        className="rounded"
        onClick={onBack}
        style={{
          border: initBorder,
        }}>
        <FaArrowLeft />
      </ToolButton>
      {FontFamlies.map((f) => {
        const isActive = f == activeLayer?.style?.fontFamily;
        return (
          <div
            key={f}
            className="p-1 px-2 flex-grow-1 rounded"
            style={{
              border: initBorder,
              fontFamily: f,
              cursor: "pointer",
              color: isActive && "var(--accent-color)",
            }}
            onClick={() => onStyleChange({ fontFamily: f })}>
            {f}
          </div>
        );
      })}
    </div>
  );
}

function FontSizePanel({ onBack, onStyleChange, activeLayer }) {
  const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64];

  return (
    <div className="d-flex gap-2 flex-wrap justify-content-center p-2">
      <ToolButton
        className="rounded-5"
        onClick={onBack}
        style={{
          border: initBorder,
        }}>
        <FaArrowLeft />
      </ToolButton>
      {fontSizes.map((t, i) => {
        return (
          <ToolButton
            className="rounded-5"
            active={t == activeLayer?.style?.fontSize}
            style={{
              minWidth: "35px",
              border: "1px solid var(--border-color)",
              height: "35px",
              placeContent: "center",
            }}
            onClick={() => {
              onStyleChange({ fontSize: t });
            }}>
            {t}
          </ToolButton>
        );
      })}
    </div>
  );
}

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
  height: min-content;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-surface);
`;

const UpperControlLeft = styled.div`
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

const BottomControl = styled.div`
  // max-width: 600px;
  overflow: auto;
  // max-height: 240px;
`;

const ColorInput = styled.input`
  background: var(--bg-card);
  cursor: pointer;
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const CanvasArea = styled.div`
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

const Canvas = styled.div`
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

const EditorControls = styled.div`
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

const ToolButton = styled.button`
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
