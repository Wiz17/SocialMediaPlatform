const DetectMentionInPost = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPosition = e.target.selectionStart;
  
  // Get text up to cursor position
  const textBeforeCursor = value.substring(0, cursorPosition ?? undefined);
  
  // Find the last @ symbol before cursor
  const lastAtIndex = textBeforeCursor.lastIndexOf('@');
  
  if (lastAtIndex !== -1) {
    // Get text after the last @ symbol
    const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
    
    // Check if there's a word after @ (no spaces and not empty)
    if (textAfterAt.length > 0 && !textAfterAt.includes(' ')) {
      return true
    } else {
      return false
    }
  } else {
   return false;
  }
}

export default DetectMentionInPost;