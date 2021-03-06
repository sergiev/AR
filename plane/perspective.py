import cv2 as cv 
import os
import json
import time
import numpy as np
root=os.path.dirname(os.path.abspath(__file__))
dlPath='/home/s3/Загрузки'#change to /home/pavel/Desktop at production
video = cv.VideoCapture(0)#change to 1 if attached
ok, frame = video.read()
frame=cv.resize(frame,(800,450))
cv.imwrite(root+'/media/planeRaw.png',frame)
os.system("xdg-open "+root+'/markupUI/markup.html')
cornerPath=dlPath+'/scene.json'
while not os.path.exists(cornerPath):
    time.sleep(1)
with open(cornerPath,'r') as cornersRaw:
	corners=json.load(cornersRaw)
	world = np.float32([corners["world"][i] for i in ("lt","rt","lb","rb")])
	screen = np.float32([corners["screen"][i] for i in ("lt","rt","lb","rb")])
	M = cv.getPerspectiveTransform(screen,world)
	dst = cv.warpPerspective(frame,M,tuple(world[-1]))
os.remove(cornerPath)
cv.imwrite(root+'/media/planeProcessed.png',dst)