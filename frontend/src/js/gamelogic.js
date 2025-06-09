// Function to reshape a 1D array into a 3D array of shape (4, 4, 4)
export function reshapeArrayMultiplayer(array) {
  let reshapedArray = [];
  let index = 0;
  for (let i = 0; i < 4; i++) {
    reshapedArray[i] = [];
    for (let j = 0; j < 4; j++) {
      reshapedArray[i][j] = [];
      for (let k = 0; k < 4; k++) {
        reshapedArray[i][j][k] = array[index];
        index++;
      }
    }
  }
  return reshapedArray;
}
