const categories = [
  { key: "all", title: "All" },
  { key: "sad", title: "Sad" },
  { key: "life", title: "Life" },
  { key: "success", title: "Success" },
  { key: "mindset", title: "Mindset" },
  { key: "failure", title: "Failure" },
  { key: "satire", title: "Satire" },
  { key: "family", title: "Family" },
  { key: "truth", title: "Truth" },
  { key: "patriotic", title: "Patriotic" },
  { key: "funny", title: "Funny" },
  { key: "ghazal", title: "Ghazal" },
  { key: "nazm", title: "Nazm" },
  { key: "sufi", title: "Sufi Shayari" },
  { key: "free-verse", title: "Free Verse" },
  { key: "lyric-poetry", title: "Lyric Poetry" },
  { key: "motivational", title: "Motivational" },
  { key: "discipline", title: "Discipline" },
  { key: "self-love", title: "Self Love" },
  { key: "narrative-poetry", title: "Narrative Poetry" },
  { key: "friendship", title: "Friendship" },
  { key: "life-quotes", title: "Life Quotes" },
  { key: "success-quotes", title: "Success Quotes" },
  { key: "sad-quotes", title: "Sad Quotes" },
];

const pre_bg_color = [
  "#A294F9",
  "#6b3ac4",
  "#89A8B2",
  "#D91656",
  "#640D5F",
  "#355F2E",
  "#441752",
  "#F72C5B",
  "#F0BB78",
  "#131010",
  "#3E5879",
  "#C84C05",
  "#074799",
  "#8D0B41",
  "#7E5CAD",
  "#500073",
  "#8D77AB",
  "#FFE9D6",
  "#D7C1E0",
  "#EEF5FF",
  "#7E30E1",
  "#B0D553",
  "#D4F6CC",
  "#171717",
  "#DA0037",
  "#217756",
  "#008DDA",
  "#664343",
  "#E0AB5B",
  "#FFA6D5",
  "#240750",
  "#3B3030",
  "#5FBDFF",
  "#7B66FF",
  "#FFF8CD",
  "#D4D7DD",
  "#A888B5",
  "#000B58",
  "#F67280",
  "#46B7B9",
  "#8D72E1",
  "#2B580C",
  // 🌇 LINEAR GRADIENTS
  "linear-gradient(to right, #ff7e5f, #feb47b)", // Sunset
  "linear-gradient(to right, #4facfe, #00f2fe)", // Sky blue
  "linear-gradient(to right, #43e97b, #38f9d7)", // Green mint
  "linear-gradient(to right, #f7971e, #ffd200)", // Orange yellow
  "linear-gradient(to right, #c33764, #1d2671)", // Purple blue
  "linear-gradient(45deg, #ff9a9e, #fad0c4)", // Diagonal pink
  "linear-gradient(to top, #a18cd1, #fbc2eb)", // Lavender pink
  "linear-gradient(to right, #e0c3fc, #8ec5fc)", // Soft purple-blue
  "linear-gradient(to right, #ffecd2, #fcb69f)", // Warm peach
  "linear-gradient(to right, #ff8177, #ff867a, #ff8c7f)", // Pink burst
  "linear-gradient(to right, #00c3ff, #ffff1c)", // Blue to yellow
  "linear-gradient(to right, #00f260, #0575e6)", // Green to blue
  "linear-gradient(to right, #fc00ff, #00dbde)", // Violet to aqua
  "linear-gradient(to right, #e1eec3, #f05053)", // Soft green red
  "linear-gradient(to right, #74ebd5, #9face6)", // Light sea
  "linear-gradient(to right, #ff6a00, #ee0979)", // Fire vibes
  "linear-gradient(to right, #fdfc47, #24fe41)", // Lime sun
  "linear-gradient(to right, #12c2e9, #c471ed, #f64f59)", // Rainbow mix
  "linear-gradient(to right, #ff9a9e, #fecfef)", // Sweet pink
  "linear-gradient(to right, #a1c4fd, #c2e9fb)", // Sky morning

  // 🌌 RADIAL GRADIENTS
  "radial-gradient(circle, #ff9a9e, #fad0c4)", // Pink ripple
  "radial-gradient(circle, #43cea2, #185a9d)", // Aqua waves
  "radial-gradient(circle, #fbc2eb, #a6c1ee)", // Pastel splash
  "radial-gradient(circle, #ffecd2, #fcb69f)", // Warm touch
  "radial-gradient(circle, #d299c2, #fef9d7)", // Pink-beige
  "radial-gradient(circle, #ffdde1, #ee9ca7)", // Peach rose
  "radial-gradient(circle, #b7f8db, #50a7c2)", // Fresh sea
  "radial-gradient(circle, #e0c3fc, #8ec5fc)", // Purple teal
  "radial-gradient(circle, #fdfcfb, #e2d1c3)", // Sand cream
  "radial-gradient(circle, #accbee, #e7f0fd)", // Calm sky

  // 🎯 CONIC GRADIENTS
  "conic-gradient(from 0deg, #ff9a9e, #fad0c4, #ff9a9e)", // Pink spin
  "conic-gradient(from 90deg, #4facfe, #00f2fe, #4facfe)", // Sky swirl
  "conic-gradient(from 180deg, #fbc2eb, #a6c1ee)", // Soft wheel
  "conic-gradient(from 0deg, #f7971e, #ffd200, #f7971e)", // Sunny swirl
  "conic-gradient(from 0deg at center, #00dbde, #fc00ff)", // Neon ring
  "conic-gradient(from 45deg at center, #00c3ff, #ffff1c)", // Bright circle
  "conic-gradient(from 0deg, #e1eec3, #f05053, #e1eec3)", // Soft rotate
  "conic-gradient(from 90deg, #ff6a00, #ee0979, #ff6a00)", // Flaming twist
  "conic-gradient(from 0deg, #a1c4fd, #c2e9fb)", // Calm motion
  "conic-gradient(from 0deg, #12c2e9, #f64f59)", // Color storm

  // 🎨 MIXED SPECIAL EFFECTS
  "linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0))", // Frosted glass
  "radial-gradient(circle at top left, #ffafbd, #ffc3a0)", // Glow corner
  "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)", // Aqua light
  "radial-gradient(ellipse at center, #89f7fe 0%, #66a6ff 100%)", // Ocean eye
  "conic-gradient(at center, #f2709c, #ff9472)", // Peach cone
  "linear-gradient(to right, #dce35b, #45b649)", // Lemon leaf
  "radial-gradient(circle, #fdfbfb, #ebedee)", // Gray puff
  "linear-gradient(to right, #00b4db, #0083b0)", // Ocean breeze
  "conic-gradient(at center, #74ebd5, #acb6e5)", // Breeze cone
  "radial-gradient(circle, #fffbd5, #b20a2c)", // Sunset splash

  "linear-gradient(to right, #ff7e5f, #feb47b)", // sunset
  "linear-gradient(to right, #4facfe, #00f2fe)", // sky blue
  "linear-gradient(to right, #43e97b, #38f9d7)", // green mint
  "linear-gradient(to right, #f7971e, #ffd200)", // orange yellow
  "linear-gradient(to right, #c33764, #1d2671)", // purple blue
  "linear-gradient(45deg, #ff9a9e, #fad0c4)", // diagonal pink
  "linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)", // lavender pink
  "linear-gradient(to right, #e0c3fc 0%, #8ec5fc 100%)", // soft purple-blue
];

const color = [
  "#A294F9",
  "#F1F0E8",
  "#89A8B2",
  "#D91656",
  "#640D5F",
  "#355F2E",
  "#441752",
  "#F72C5B",
  "#F0BB78",
  "#131010",
  "#3E5879",
  "#C84C05",
  "#074799",
  "#8D0B41",
  "#7E5CAD",
  "#500073",
  "#8D77AB",
  "#FFE9D6",
  "#D7C1E0",
  "#EEF5FF",
  "#7E30E1",
  "#B0D553",
  "#D4F6CC",
  "#171717",
  "#DA0037",
  "#217756",
  "#008DDA",
  "#664343",
  "#E0AB5B",
  "#FFA6D5",
  "#240750",
  "#3B3030",
  "#5FBDFF",
  "#7B66FF",
  "#FFF8CD",
  "#D4D7DD",
  "#A888B5",
  "#000B58",
  "#F67280",
  "#46B7B9",
  "#8D72E1",
  "#2B580C",
];

const fontFamily = [
  "Arial",
  "Times New Roman",
  "Courier New",
  "Georgia",
  "Verdana",
  "Comic Sans MS",
  "Tahoma",
  "Lucida Console",
  "Helvetica",
  "Trebuchet MS",
  "Impact",
  "Palatino Linotype",
  "Book Antiqua",
  "Lucida Sans Unicode",
  "Garamond",
  "Segoe UI",
];

const fontSize = [
  7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 22, 24, 26, 28, 30, 34, 38,
  40, 45, 50, 55, 60, 70,
];

const letterSpacing = [
  0.1, 0.2, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 22, 24, 26, 28, 30, 34, 38,
];

const textDecoration = ["none", "underline", "overline", "line-through"];

const textShadow = [
  "none",
  "1px 1px 2px black",
  "2px 2px 4px rgba(0, 0, 0, 0.5)",
  "0 0 3px #FF0000",
  "0 0 5px #00FFFF",
  "1px 0 5px #000",
  "2px 2px 0 #999",
  "0 1px 3px rgba(0,0,0,0.3)",
  "1px 1px 1px rgba(255,255,255,0.8)",
  "2px 2px 8px #444",
  "0 0 10px #FFF, 0 0 20px #F0F, 0 0 30px #0FF",
  "3px 3px 5px rgba(0,0,0,0.7)",
  "1px 2px 2px #333",
  "-1px -1px 0 #000, 1px 1px 0 #fff", // outline effect
  "4px 4px 6px rgba(0,0,0,0.4)",
  "0px 4px 3px rgba(0, 0, 0, 0.3)",
];

const boxShadow = [
  "none",
  "1px 1px 2px black",
  "2px 2px 4px rgba(0, 0, 0, 0.5)",
  "0 0 3px #FF0000",
  "0 0 5px #00FFFF",
  "1px 0 5px #000",
  "2px 2px 0 #999",
  "0 1px 3px rgba(0,0,0,0.3)",
  "1px 1px 1px rgba(255,255,255,0.8)",
  "2px 2px 8px #444",
  "0 0 10px #FFF, 0 0 20px #F0F, 0 0 30px #0FF",
  "3px 3px 5px rgba(0,0,0,0.7)",
  "1px 2px 2px #333",
  "-1px -1px 0 #000, 1px 1px 0 #fff", // outline effect
  "4px 4px 6px rgba(0,0,0,0.4)",
  "0px 4px 3px rgba(0, 0, 0, 0.3)",
];

const backgroundPosition = [
  "center top",
  "center center",
  "center bottom",
  "bottom",
  "top",
  "right",
  "left",
];

const backgroundSize = [
  "auto", // default
  "cover", // scale to cover entire area
  "contain", // scale to fit inside the area
  "100% 100%", // stretch to fill
  "50% 50%", // half width and height
  "100% auto", // full width, auto height
  "auto 100%", // auto width, full height
];

const objectPosition = [];
// const { search } = useLocation();
// const params = new URLSearchParams(search);

// const postId = params.get("postId");
// // Scroll into postId if available
// useEffect(() => {
//   if (postId) {
//     const target = document.getElementById(postId);
//     if (target) {
//       target.scrollIntoView({ behavior: "smooth", block: "start" });
//     }
//   }
// }, [postId, posts]);
// Merge posts with user info

export {
  categories,
  letterSpacing,
  color,
  fontFamily,
  fontSize,
  pre_bg_color,
  backgroundSize,
  backgroundPosition,
  textDecoration,
  textShadow,
  boxShadow,
  objectPosition,
};
