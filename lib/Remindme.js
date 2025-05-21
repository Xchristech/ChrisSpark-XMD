const fs = require("fs");
const path = require("path");
const { parseTime } = require("./timeparser");

const REMINDER_PATH = path.join(__dirname, "../reminder.json");
let reminders = [];

if (fs.existsSync(REMINDER_PATH)) {
  try {
    reminders = JSON.parse(fs.readFileSync(REMINDER_PATH));
    restoreReminders();
  } catch (e) {
    console.error("Failed to load reminders:", e);
    reminders = [];
  }
}

function saveReminders() {
  fs.writeFileSync(REMINDER_PATH, JSON.stringify(reminders, null, 2));
}

function addReminder(chatId, message, time, sendCallback) {
  const reminder = {
    id: Date.now(),
    chat: chatId,
    message,
    time,
  };
  reminders.push(reminder);
  saveReminders();
  scheduleReminder(reminder, sendCallback);
  return reminder;
}

function getReminders(chatId) {
  return reminders.filter((r) => r.chat === chatId);
}

function scheduleReminder(reminder, sendCallback) {
  const delay = reminder.time - Date.now();
  if (delay <= 0) return; // Too late to schedule

  if (delay > 2147483647) { // If the delay exceeds the 32-bit limit
    const interval = setInterval(() => {
      const remainingDelay = reminder.time - Date.now();
      if (remainingDelay <= 0) {
        sendCallback(reminder);
        removeReminder(reminder.id);
        clearInterval(interval); // Clear the interval once the reminder is triggered
      }
    }, 2147483647); // Use the maximum delay for the interval
  } else {
    setTimeout(() => {
      sendCallback(reminder);
      removeReminder(reminder.id);
    }, delay);
  }
}

function restoreReminders() {
  reminders.forEach((reminder) => {
    scheduleReminder(reminder, (r) => {
      global.ChrisSpark.sendMessage(r.chat, { text: `⏰ Reminder:\n${r.message}` });
    });
  });
}

function removeReminder(id) {
  reminders = reminders.filter((r) => r.id !== id);
  saveReminders();
}

module.exports = {
  addReminder,
  getReminders,
  removeReminder,
  parseTime,
};
