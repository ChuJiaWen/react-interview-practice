const [isTabClick, setIsTabClick] = useState(false);
const rightListRef = useRef(null);

const handleTabClick = (targetId) => {
  setIsTabClick(true);
  const targetEl = document.getElementById(targetId);
  targetEl?.scrollIntoView({ behavior: "smooth" });
};

useEffect(() => {
  if (!isTabClick) return;

  let lastScrollTop = 0;
  const checkScrollEnd = () => {
    const currentScrollTop = rightListRef.current?.scrollTop || 0;
    if (Math.abs(currentScrollTop - lastScrollTop) < 1) {
      setIsTabClick(false); // 滚动结束，重置标记
    } else {
      lastScrollTop = currentScrollTop;
      requestAnimationFrame(checkScrollEnd);
    }
  };

  // 启动第一次检查
  requestAnimationFrame(checkScrollEnd);
}, [isTabClick]);

// 右侧列表 ref 绑定：<div ref={rightListRef} onScroll={handleScroll}>...</div>
