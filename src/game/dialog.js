export function createDialogState(lines) {
  return {
    lines,
    active: false,
    index: 0,
  };
}

export function openDialog(dialog) {
  dialog.active = true;
  dialog.index = 0;
}

export function closeDialog(dialog) {
  dialog.active = false;
  dialog.index = 0;
}

export function advanceDialog(dialog) {
  if (!dialog.active) {
    return;
  }

  dialog.index += 1;
  if (dialog.index >= dialog.lines.length) {
    closeDialog(dialog);
  }
}

export function getDialogLine(dialog) {
  if (!dialog.active) {
    return "";
  }
  return dialog.lines[dialog.index];
}
