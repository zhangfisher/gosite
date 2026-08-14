// 防 FOUC：在 hydration 前应用正确的主题
// 由根 layout 的 <head> 同步加载（无 async/defer），早于首帧绘制执行
(function () {
  var storedTheme = localStorage.getItem("theme");

  // 只有明确设置为 dark 时才使用暗色模式，否则默认浅色
  if (storedTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
})();
