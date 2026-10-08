function findFirstTarget(nums, target) {
  // 给定有序数组，可能包含重复元素，找到目标值第一次出现的位置，要求时间复杂度小于 O(n)
  let left = 0,
    right = nums.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);

    if (nums[mid] < target) {
      left = mid + 1;
    } else if (nums[mid] > target) {
      right = mid - 1;
    } else if (nums[mid] == target) {
      while (mid >= left && nums[mid - 1] == target) {
        mid--;
      }
      return mid;
    }
  }
  return -1;
}

const nums = [1, 2, 2, 2, 3, 4];
console.log(findFirstTarget(nums, 4));
console.log(findFirstTarget(nums, 2));
console.log(findFirstTarget(nums, 5));
