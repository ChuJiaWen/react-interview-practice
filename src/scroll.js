const visibleItemsRef = useRef(new Set());
const observer = useRef(null);

useEffect(() => {
  observer.current = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const index = Number(entry.target.dataset.index);
        if (entry.isIntersecting) {
          visibleItemsRef.current.add(index);
        } else {
          visibleItemsRef.current.delete(index);
        }
      });
    },
    { root: containerRef.current, threshold: 0.1 },
  );

  const items = containerRef.current.querySelectorAll(".item");
  items.forEach((item, index) => {
    item.dataset.index = index;
    observer.current.observe(item);
  });

  return () => observer.current.disconnect();
}, []);

const handleScroll = useThrottle(() => {
  if (visibleItemsRef.current.size === 0) return;
  const firstIndex = Math.min(...visibleItemsRef.current);
  setActiveTab(firstIndex);
}, 200);



useEffect(() => {
  const container = containerRef.current;
  container.addEventListener("scroll", handleScroll);
  return () => container.removeEventListener("scroll", handleScroll);
}, [handleScroll]);

const handleTabClick = (index) => {
  setActiveTab(index);
  const container = containerRef.current;
  const targetItem = itemRefs[index].current;
  // 定义滚动结束的回调
  const animationEndHandler = () => {
    setIsManualClick(false);
    container.removeEventListener("animationend", animationEndHandler);
  };
  // 标记手动点击状态
  setIsManualClick(true);
  // 触发平滑滚动
  targetItem.scrollIntoView({ behavior: "smooth", block: "start" });
  // 添加动画结束监听
  container.addEventListener("animationend", animationEndHandler);
};
