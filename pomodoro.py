import tkinter as tk
from tkinter import messagebox
import time
import pygame
import threading
from PIL import Image, ImageTk

class PomodoroApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Pomodoro Timer")

        # Load background image
        self.bgImage = Image.open("tomato.png")
        self.bgImage = self.bgImage.resize((800, 600), Image.LANCZOS)
        self.bgPhoto = ImageTk.PhotoImage(self.bgImage)

        # Create a label to hold the background image
        self.bgLabel = tk.Label(root, image=self.bgPhoto)
        self.bgLabel.place(relwidth=1, relheight=1)

        # Set the custom font
        self.customFont = ("Sawarabi Mincho", 24)

        self.workTime = 10  # 10 minutes in seconds
        self.breakTime = 10  # 10 minutes in seconds
        self.isRunning = False
        self.isWorkSession = True

        self.timeLeft = self.workTime

        self.label = tk.Label(root, text="PoMoStRikE PomOdOrO TimEr", font=self.customFont, bg="white", fg="black")
        self.label.pack(pady=20)

        self.timerLabel = tk.Label(root, text=self.formatTime(self.timeLeft), font=("Helvetica", 48), bg="white", fg="black")
        self.timerLabel.pack(pady=20)

        self.startButton = tk.Button(root, text="Start", command=self.startTimer, font=self.customFont, bg="lightblue", fg="black")
        self.startButton.pack(side=tk.LEFT, padx=20)

        self.resetButton = tk.Button(root, text="Reset", command=self.resetTimer, font=self.customFont, bg="lightblue", fg="black")
        self.resetButton.pack(side=tk.RIGHT, padx=20)

        pygame.mixer.init()

    def formatTime(self, seconds):
        minutes = seconds // 60
        seconds = seconds % 60
        return f"{minutes:02}:{seconds:02}"

    def startTimer(self):
        if not self.isRunning:
            self.isRunning = True
            self.runTimer()

    def runTimer(self):
        if self.isRunning:
            if self.timeLeft > 3:
                self.timeLeft -= 1
                self.timerLabel.config(text=self.formatTime(self.timeLeft))
                self.root.after(1000, self.runTimer)
            elif self.timeLeft == 3:
                threading.Thread(target=self.fadeInMusic).start()  # Start fading in the music in a separate thread
                self.timeLeft -= 1
                self.timerLabel.config(text=self.formatTime(self.timeLeft))
                self.root.after(1000, self.runTimer)
            elif self.timeLeft > 0:
                self.timeLeft -= 1
                self.timerLabel.config(text=self.formatTime(self.timeLeft))
                self.root.after(1000, self.runTimer)
            else:
                self.isRunning = False
                self.promptMessageBox()

    def resetTimer(self):
        self.isRunning = False
        self.isWorkSession = True
        self.timeLeft = self.workTime
        self.timerLabel.config(text=self.formatTime(self.timeLeft))
        threading.Thread(target=self.fadeOutMusic).start()  # Start fading out the music in a separate thread

    def switchSession(self):
        if self.isWorkSession:
            self.timeLeft = self.breakTime
            self.isWorkSession = False
        else:
            self.timeLeft = self.workTime
            self.isWorkSession = True
        self.startTimer()  # Automatically start the next session

    def promptMessageBox(self):
        if self.isWorkSession:
            messagebox.showinfo("Break Time", "Take a break!")
        else:
            messagebox.showinfo("Work Time", "Time to focus!")
        self.switchSession()

    def fadeInMusic(self):
        soundFile = "work_jingle.mp3" if self.isWorkSession else "break_jingle.mp3"
        pygame.mixer.music.load(soundFile)
        pygame.mixer.music.play()  # Play once
        for i in range(0, 11):
            pygame.mixer.music.set_volume(i / 10.0)
            time.sleep(0.3)  # Gradually increase volume over 3 seconds

    def fadeOutMusic(self):
        currentVolume = pygame.mixer.music.get_volume()
        while pygame.mixer.music.get_busy() and currentVolume > 0:
            currentVolume -= 0.1
            if currentVolume < 0:
                currentVolume = 0
            pygame.mixer.music.set_volume(currentVolume)
            time.sleep(0.3)  # Adjust the sleep time as needed for smoother fading
        pygame.mixer.music.stop()

if __name__ == "__main__":
    root = tk.Tk()
    root.geometry("800x600")  # Set window size
    app = PomodoroApp(root)
    root.mainloop()
