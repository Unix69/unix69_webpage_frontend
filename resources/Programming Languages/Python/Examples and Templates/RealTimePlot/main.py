import threading
import tkinter as tk
from datetime import datetime
from tkinter import *
from PIL import Image
import matplotlib.pyplot as plt
from PIL import ImageTk
from matplotlib.backends._backend_tk import NavigationToolbar2Tk
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import paho.mqtt.client as mqtt
import json

HR = []
DS = []
HRV = []
RR = []

discoveryMac = True
macSelected = False
macaddrs = []
selected_mac = ""
timestart_discovery = datetime.now()


def select_mac():
    global clicked
    global selected_mac
    global macSelected
    global HR
    global HRV
    global RR
    global DS

    new_mac = clicked.get()

    if selected_mac != new_mac:
        HR = []
        HRV = []
        RR = []
        DS = []
        selected_mac = new_mac

    macSelected = True

def create_dp_menu():
    global macaddrs
    global clicked
    global frameControl
    # datatype of menu text
    clicked = tk.StringVar()
    clicked.set(str(macaddrs[0]))
    # Create Dropdown menu
    drop = tk.OptionMenu(frameControl, clicked, *macaddrs)
    drop.config(bg='lightgray', borderwidth=4)
    drop.grid(row=1, column=0, padx=8)
    # Create button, it will change label text
    button = tk.Button(frameControl, border=8, borderwidth=4, text="Select Mac Address", command=select_mac, bg='lightgray').grid(row=1, column=1, padx=8, pady=8)

def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))

    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.

    client.subscribe("PREDICTS/#")


# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    global numberOfRecords
    global discoveryMac
    global macaddrs
    global firstDataRead
    global macSelected
    global selected_mac
    global drop
    global HR
    global HRV
    global RR
    global DS

    if discoveryMac:
        macaddrs.append(str(msg.topic.split('/')[1]))
        macaddrs = list(set(macaddrs))
        if (datetime.now() - timestart_discovery).total_seconds() >= 15:
            discoveryMac = False
            create_dp_menu()
    else:
        if macSelected and selected_mac == str(msg.topic.split('/')[1]):
            jsonMessage = json.loads(str(msg.payload.decode("utf-8")))
            if len(HR)<300:
                HR.append(int(jsonMessage['HR']))
                HRV.append(int(jsonMessage['HRV']))
                RR.append(int(jsonMessage['RR']))
                DS.append(int(str(jsonMessage['Drowsiness state'])[4:5]))
            else:
                # So is more efficient
                HR = HR[1:len(HR)]
                HR.append(int(jsonMessage['HR']))
                HRV = HRV[1:len(HRV)]
                HRV.append(int(jsonMessage['HRV']))
                RR = RR[1:len(RR)]
                RR.append(int(jsonMessage['RR']))
                DS = DS[1:len(DS)]
                DS.append(int(str(jsonMessage['Drowsiness state'])[4:5]))
                #for i in range(1, len(HR)):
                #    HR[i-1]=HR[i]
                #    HRV[i-1]=HRV[i]
                #    RR[i-1]=RR[i]
                #    DS[i-1]=DS[i]
                #HR[len(HR)-1]=int(jsonMessage['HR'])
                #HRV[len(HR)-1]=int(jsonMessage['HRV'])
                #RR[len(HR)-1]=int(jsonMessage['RR'])
                #DS[len(HR)-1]=int(str(jsonMessage['Drowsiness state'])[4:5])

    print(msg.topic + " " + str(msg.payload))

# MQTT management
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.username_pw_set("rw", "readwrite")
client.connect("sat01.satechnologies.eu", 1883, 60)

def mqtt_thread():
    global client
    client.loop_forever()

mqtt_thread = threading.Thread(target=mqtt_thread)
mqtt_thread.start()

# Create root window
root = tk.Tk()
root.configure(bg='lightgray', border=4, borderwidth=4, takefocus=True, relief='sunken')
root.resizable(width=False, height=False)

# Set Tk window title
root.title("Dashboard")


plt.style.use('ggplot')
#plt.style.use('bmh')
#plt.style.use('seaborn-v0_8')
#plt.style.use('fivethirtyeight')
#plt.style.use('fast')
#plt.style.use('grayscale')
#plt.style.use('seaborn-v0_8-dark')
#plt.style.use('seaborn-v0_8-darkgrid')
#plt.style.use('seaborn-v0_8-notebook')
#plt.style.use('seaborn-v0_8-deep')
#plt.style.use('seaborn-v0_8-muted')
#plt.rcParams.update({'axes.facecolor':'lightblue'})
#plt.rcParams.update({'savefig.facecolor':'blue'})
plt.rcParams.update({'font.size': 6})
plt.rcParams.update({'lines.linewidth':3})
#plt.rcParams.update({'font.family': 'helvetica'})
plt.rcParams.update({'font.family': 'serif'})


frameTitle = LabelFrame(root, text="Logs", bg="lightgray",
                    fg="black", padx=8, pady=16, font='serif', borderwidth=4)

frameFigures = LabelFrame(root, text="Chart Plottings", bg="lightgray",
                    fg="black", padx=8, pady=16, font='serif', borderwidth=8)

frameControl = LabelFrame(root, text="Source Control", bg="lightgray",
                    fg="black", padx=8, pady=16, font='serif', borderwidth=4)


# Displaying the frame1 in row 0 and column 0
frameTitle.grid(row=0, column=0, padx=2, pady=2, sticky='W')
frameFigures.grid(row=1, column=0, padx=2, pady=2, sticky='WE')
frameControl.grid(row=0, column=0, sticky='E')

frameFigureHR = tk.Frame(master=frameFigures)
frameFigureHRV = tk.Frame(master=frameFigures)
frameFigureRR = tk.Frame(master=frameFigures)
frameFigureDS = tk.Frame(master=frameFigures)

frameFigureHR.grid(row=0, column=0, padx=16, pady=8)
frameFigureHRV.grid(row=0, column=1, padx=16, pady=8)
frameFigureRR.grid(row=1, column=0, padx=4, pady=8)
frameFigureDS.grid(row=1, column=1, padx=4, pady=4)


# Icon setting
photo = tk.PhotoImage(file='app_logo.png')
root.wm_iconphoto(False, photo)

# Title frame setting
imgsat = ImageTk.PhotoImage(Image.open("app_logo.png").resize((48,48)))
panelsat = tk.Label(frameTitle, image =imgsat)
#panelsat.pack(side ="left", pady=4, padx=4, expand=True)
panelsat.grid(row=0, column=0, pady=4, padx=4)
imgpolito = ImageTk.PhotoImage(Image.open("logo.png").resize((96,48)))
panelpolito = tk.Label(frameTitle, image =imgpolito)
#panelpolito.pack(side ="left", pady=4, padx=4, expand=True)
panelpolito.grid(row=0, column=1, pady=4, padx=4)

# Figure frame setting
figureHR = plt.Figure(figsize=(5, 3), dpi=100, frameon=True, layout='constrained')
axHR = figureHR.add_subplot(111)
axHR.set_ylabel("HR [bpm]")
axHR.set_xlabel("Samples")
axHR.set_title('Heart Rate')
lineHR, = axHR.plot([], [], '-', c='#0ADB07')
axHR.set_xlim(left=0, right=len(HR)+1)
axHR.legend(['HR'])
canvasHR = FigureCanvasTkAgg(figureHR, frameFigureHR)
canvasHR.get_tk_widget().grid(row=1, column=0, pady=4, padx=4)
toolbarFrameHR = tk.Frame(master=frameFigureHR)
toolbarFrameHR.grid(row=0, column=0, padx=16, pady=8)
toolbarHR = NavigationToolbar2Tk(canvasHR, toolbarFrameHR)

figureHRV = plt.Figure(figsize=(5, 3), dpi=100, frameon=True, layout='constrained')
axHRV = figureHRV.add_subplot(111)
axHRV.set_ylabel("HRV [ms]")
axHRV.set_xlabel("Samples")
#axHRV.set_xlim(left=0)
axHRV.set_title('Heart Rate Variability')
lineHRV, = axHRV.plot([], [], '-', c='#0964EB')
axHRV.set_xlim(left=0, right=len(HRV)+1)
axHRV.legend(['HRV'])
canvasHRV = FigureCanvasTkAgg(figureHRV, frameFigureHRV)
canvasHRV.get_tk_widget().grid(row=1, column=1, pady=4, padx=4)
toolbarFrameHRV = tk.Frame(master=frameFigureHRV)
toolbarFrameHRV.grid(row=0, column=1, padx=16, pady=8)
toolbarHRV = NavigationToolbar2Tk(canvasHRV, toolbarFrameHRV)


figureRR = plt.Figure(figsize=(5, 3), dpi=100, frameon=True, layout='constrained')
axRR = figureRR.add_subplot(111)
axRR.set_ylabel("RR [rpm]")
axRR.set_xlabel("Samples")
axRR.set_title('Respiration Rate')
lineRR, = axRR.plot([], [], '-', c='#05F2C7')
axRR.set_xlim(left=0, right=len(RR)+1)
axRR.legend(['RR'])
canvasRR = FigureCanvasTkAgg(figureRR, frameFigureRR)
canvasRR.get_tk_widget().grid(row=0, column=0, pady=4, padx=4)
toolbarFrameRR = tk.Frame(master=frameFigureRR)
toolbarFrameRR.grid(row=1, column=0, padx=16, pady=8)
toolbarRR = NavigationToolbar2Tk(canvasRR, toolbarFrameRR)



figureDS = plt.Figure(figsize=(5, 3), dpi=100, frameon=True, layout='constrained')
axDS = figureDS.add_subplot(111)
axDS.set_ylabel("DS")
axDS.set_xlabel("Samples")
axDS.set_title('Drowsiness State Index')
#lineDS, = axDS.plot([], [], '-', c='blue')
axDS.fill_between(x=[], y1=[], y2=[], **{'color':'#F2F005'})
axDS.legend(['DS Index'])
axDS.set_xlim(left=0, right=len(DS)+1)
axDS.set_ylim([0, 5])

canvasDS = FigureCanvasTkAgg(figureDS, frameFigureDS)
canvasDS.get_tk_widget().grid(row=0, column=0, pady=4, padx=28)
toolbarFrameDS = tk.Frame(master=frameFigureDS)
toolbarFrameDS.grid(row=1, column=0, padx=16, pady=8)
toolbarDS = NavigationToolbar2Tk(canvasDS, toolbarFrameDS)



def update_plot_hr():
    import numpy as np

    global root
    global HR
    global axHR
    global canvasHR

    # Generate random data points for demonstration
    # Update the plot
    lineHR.set_data(np.linspace(0, len(HR), len(HR)), HR)
    axHR.relim()
    axHR.autoscale_view(True, True, True)
    axHR.set_xlim(left=0, right=len(HR)+1)
    canvasHR.draw()
    # Schedule the next update
    root.after(1000, update_plot_hr)  # Update every 1 second (1000 milliseconds)


def update_plot_hrv():
    import numpy as np

    global root
    global HRV
    global axHRV
    global canvasHRV

    # Generate random data points for demonstration
    # Update the plot
    lineHRV.set_data(np.linspace(0, len(HRV), len(HRV)), HRV)
    axHRV.relim()
    axHRV.autoscale_view(True, True, True)
    axHRV.set_xlim(left=0, right=len(HRV)+1)
    canvasHRV.draw()
    # Schedule the next update
    root.after(1000, update_plot_hrv)  # Update every 1 second (1000 milliseconds)

def update_plot_rr():
    import numpy as np

    global root
    global RR
    global axRR
    global canvasRR

    # Generate random data points for demonstration
    # Update the plot
    lineRR.set_data(np.linspace(0, len(RR), len(RR)), RR)
    axRR.relim()
    axRR.autoscale_view(True, True, True)
    axRR.set_xlim(left=0, right=len(RR)+1)
    canvasRR.draw()
    # Schedule the next update
    root.after(1000, update_plot_rr)  # Update every 1 second (1000 milliseconds)

def update_plot_ds():
    import numpy as np

    global root
    global DS
    global axDS
    global canvasDS

    # Generate random data points for demonstration
    # Update the plot
    #lineDS.set_data(np.linspace(0, len(DS), len(DS)), DS)


    y1 = [0 for i in range(0, len(DS), 1)]
    x =  [i for i in range(0, len(DS), 1)]
    axDS.fill_between(x=x, y1=y1, y2=DS, **{'color':'#F2F005'})
    axDS.relim()
    axDS.autoscale_view(True, True, True)
    axDS.set_xlim(left=0, right=len(DS)+1)
    axDS.set_ylim([0, 5])
    canvasDS.draw()
    # Schedule the next update
    root.after(1000, update_plot_ds)  # Update every 1 second (1000 milliseconds)


# Start the initial plot update
root.after(15000, update_plot_hr)
root.after(15000, update_plot_hrv)
root.after(15000, update_plot_rr)
root.after(15000, update_plot_ds)

# Start the Tkinter event loop
root.mainloop()















































