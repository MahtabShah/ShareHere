export const caret = document.createElement("div");
caret.className = "caret";

export const newRow = () => {
  const newLine = document.createElement("div");
  newLine.classList.add("row-x");
  newLine.classList.add("new-row-x");

  document.querySelectorAll(".pad-l select").forEach((el, i) => {
    if (i == 1) el.value = 0;
    let p = el.value;
    let m = el.dataset.value;

    newLine.style[m] = `${p}rem`;
    return p;
  });

  return newLine;
};

export const newSpan = (ch) => {
  let span = document.createElement("span");
  span.innerHTML = ch;
  span.className = "ch";
  return span;
};

export const removeCaret = () => {
  document.querySelectorAll(".caret").forEach((c) => {
    c.remove();
  });
};

export const appendCaret = (rows, curr, r, c, dir) => {
  const target = curr?.[c - 1] || curr?.[c];
  // console.log("caret at", r, c);

  if (target) target[dir == 1 ? "append" : "prepend"](caret);
  else rows[r].append(caret);
};

export const setCaret = (editor, r, c, dir = 1) => {
  if (c < 0) c = 0;
  removeCaret();
  const rows = [...document.querySelectorAll(".row-x")];
  document.querySelector(".r-select select").value = parseInt(
    rows[r].style.marginLeft
  );

  if (0 > r || r > rows.length - 1) r = 0;

  let rowRef = document.querySelector(".r-c");
  rowRef.innerHTML = `[ ${r} ${c} ]`;

  const curr = [...(rows[r]?.children || [])];
  appendCaret(rows, curr, r, c, dir);

  rows[r].append(...curr);

  editor.innerHTML = "";
  editor.append(...rows);

  document.querySelectorAll(".pad-l select").forEach((el, i) => {
    let m = el.dataset.value;

    el.value = parseInt(window.getComputedStyle(rows[r])[m]) / 16;
  });
};

export const dimension = (e, span) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left; // distance from left border
  const y = e.clientY - rect.top; // distance from top border
  const wd = parseFloat(window.getComputedStyle(span).width) * 0.5;

  return [x, y, wd];
};

const rgbToHex = (rgb) => {
  const res = rgb?.match(/\d+/g);
  console.log(res, rgb);
  if (!res) return rgb;

  return (
    "#" +
    res
      .slice(0, 3)
      .map((x) => (+x).toString(16).padStart(2, "0"))
      .join("")
  );
};

export const setOptions = function (span) {
  const parent = document.querySelector(".stylez");
  const reactStyle = Object.fromEntries(
    [...span.style].map((p) => [
      p.replace(/-([a-z])/g, (_, c) => c.toUpperCase()),
      span.style.getPropertyValue(p),
    ])
  );

  reactStyle["color"] = rgbToHex(reactStyle["color"]);
  reactStyle["backgroundColor"] = rgbToHex(reactStyle["backgroundColor"]);
  const opstions = Object.entries(reactStyle);

  // console.log(rgbToHex(reactStyle["color"]));

  opstions?.forEach((op) => {
    const [u, v] = op;
    const elms = parent.querySelectorAll(`.${u}`);

    elms.forEach((el) => {
      el.classList?.remove("active");
    });

    elms.forEach((el) => {
      if (el.dataset.value == v) {
        el.classList.add("active");
      }
    });
  });
};

export const getStyle = function () {
  const obj = {};
  document.querySelectorAll(".stylez .active").forEach((el) => {
    const prop = el.dataset.prop;
    const value = el.dataset.value;
    obj[prop] = value;
  });

  document.querySelectorAll(".stylez select").forEach((en) => {
    const el = en.selectedOptions[0];
    const prop = el?.dataset.prop;
    const value = el?.dataset.value;
    obj[prop] = value;
  });

  console.log(obj);

  return obj;
};

export const editorOn = (editor) => {
  let { r, c, dir } = { r: -1, c: -1, dir: 1 };

  document.querySelector(".txt-center").addEventListener("click", () => {
    let row = [...editor.querySelectorAll(".row-x")]?.[r];

    row.classList.toggle("justify-content-center");
  });

  const InsertNextLine = () => {
    removeCaret();
    const newLine = newRow();

    let rows = [...editor.querySelectorAll(".row-x")];

    if (r >= 0) {
      const innerHtml = [...(rows[r]?.children || [])].slice(c);
      newLine.append(...innerHtml);
    }

    r += 1;
    c = 0;

    newLine.addEventListener("click", (e) => {
      removeCaret();
      let rows = [...editor.querySelectorAll(".row-x")];
      e.stopPropagation();
      r = rows.indexOf(newLine);
      c = [...rows[r].children].length;

      setCaret(editor, r, c, dir);
    });

    rows.splice(r, 0, newLine);

    // console.log(rows);
    editor.innerHTML = "";
    editor.append(...rows);
    setCaret(editor, r, c, -1);
  };

  const charClick = (e, span) => {
    e.stopPropagation();
    removeCaret();

    const [x, y, wd] = dimension(e, span);

    let parent = span.parentElement;

    let rows = [...editor.querySelectorAll(".row-x")];

    r = rows.indexOf(parent);
    c = [...rows[r].children].indexOf(span) + 1;
    dir = 1;

    if (x < wd) {
      c--;
      if (c == 0) dir = -1;
    }

    setOptions(span);

    setCaret(editor, r, c, dir);
  };

  const DeleteChar = () => {
    if (c == 0 && r == 0) return;

    let rows = [...editor.querySelectorAll(".row-x")];

    if (c == 0) {
      const innerHtml = [...rows[r].children];
      c = [...rows[r - 1].children].length;
      rows[r]?.remove();
      rows[r - 1].append(...innerHtml);
      r--;
    } else {
      let cols = [...rows[r].children][c - 1];
      cols?.remove();
      c--;
    }

    if (c == 0) setCaret(editor, r, c, -1);
    else setCaret(editor, r, c, 1);
  };

  const InsertChar = (ch) => {
    removeCaret();

    let span = newSpan(ch);

    span.addEventListener("click", (e) => {
      charClick(e, span);
    });

    // console.log("add char at", r, c);

    let rows = [...editor.querySelectorAll(".row-x")];

    const curr = [...(rows[r]?.children || [])];

    const updatedRow = [...(curr?.slice(0, c) || []), span, ...(curr?.slice(c) || [])];
    rows[r].append(...updatedRow);

    editor.innerHTML = "";
    editor.append(...rows);

    setCaret(editor, r, ++c, dir);

    Object.assign(span.style, getStyle());
  };

  function getSelectedSpans(container) {
    const selection = window.getSelection();
    if (!selection || selection?.rangeCount === 0) return [];

    const range = selection?.getRangeAt(0);
    const spans = Array.from(container.querySelectorAll("span"));

    return spans?.filter((span) => isFullySelected(span, range)) || [];
  }

  function isFullySelected(span, range) {
    const spanRange = document.createRange();
    spanRange?.selectNodeContents(span);

    return (
      range.compareBoundaryPoints(Range.START_TO_START, spanRange) <= 0 &&
      range.compareBoundaryPoints(Range.END_TO_END, spanRange) >= 0
    );
  }

  const HandleDelete = () => {
    const selectedSpans = getSelectedSpans(editor);

    console.log(selectedSpans);

    if (!selectedSpans?.length) DeleteChar();

    selectedSpans?.forEach((s) => {
      s.remove();
      c--;
      setCaret(editor, r, c);
    });
    return selectedSpans;
  };

  const HandelAction = async (evt) => {
    evt.preventDefault();

    let key = evt.key?.toString();

    if (evt.ctrlKey || evt.metaKey) {
      if (key.toLowerCase() === "v") {
        let chars = await navigator.clipboard.readText();
        for (const ch of chars) {
          InsertChar(ch);
        }
      }
    } else if (evt.shiftKey && key.length == 1) {
      InsertChar(key.toUpperCase());
    } else if (key == "ArrowRight") {
      let rows = [...editor.querySelectorAll(".row-x")];
      let len = [...rows[r].children].length;
      if (c < len - 1) {
        c++;
        setCaret(editor, r, c);
      }
    } else if (key == "ArrowLeft") {
      if (c) {
        c--;
        setCaret(editor, r, c);
      }
    } else if (key === "Enter") {
      InsertNextLine();
    } else if (key === "Backspace") {
      HandleDelete();
    } else if (key?.length == 1) {
      InsertChar(key);
    }

    return;
  };

  InsertNextLine();

  document.addEventListener("keydown", HandelAction);

  document.querySelector(".editor").addEventListener("click", (e) => {
    e.stopPropagation();
    r = editor.querySelectorAll(".row-x").length - 1;
    c = editor.querySelectorAll(".row-x")?.[r]?.children?.length - 1;

    if (r <= 0 || !r) r = 0;
    if (c <= 0 || !c) c = 0;
    else c += 1;

    setCaret(editor, r, c, 1);
  });

  const box = document.querySelector("#myInput");

  // document.addEventListener("click", (e) => {
  //   if (!box.contains(e.target)) {
  //     // console.log("coming...", e.target);
  //     caret?.remove();
  //   }
  // });

  document.querySelectorAll(".pad-l select").forEach((el) =>
    el.addEventListener("input", (e) => {
      let p = e.target.value;
      let m = e.target.dataset.value;
      // console.log(e.target.dataset.value);

      document.querySelectorAll(".row-x")[r].style[m] = `${p}rem`;
      return p;
    })
  );

  const input = document.querySelector("#myInput");

  input.addEventListener("keydown", () => {
    input.value = "";
  });

  input.addEventListener("paste", async (e) => {
    // e.preventDefault(); // default paste rok do

    // Clipboard se direct text read karo (mobile-safe)
    setTimeout(() => {
      let txt = input.value;

      // har character ko InsertChar se process karo
      for (const ch of txt) InsertChar(ch);

      // Input clear karo
      input.value = "";
    }, 0);
  });
};
