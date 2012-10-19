/*
 canvas-ios-checkbox - A canvas2d checkbox in iOS style
 BSD license.
 by Sven Nilsen, 2012
 http://www.cutoutpro.com
 
 Version: 0.000 in angular degrees version notation
 http://isprogrammingeasy.blogspot.no/2012/08/angular-degrees-versioning-notation.html
 */
/*
 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:
 1. Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer.
 2. Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 The views and conclusions contained in the software and documentation are those
 of the authors and should not be interpreted as representing official policies,
 either expressed or implied, of the FreeBSD Project.
 */

/*
 
 _______________________
 HOW TO USE THIS LIBRARY
 
 1. Create a canvas inside the body tag:
 
 	<canvas id="mycheckbox" width="80" height="28"></canvas>
 
 2. Add this inside header tag:
 
 <script type="text/javascript" src="checkbox.js"></script>
 <script language="javascript">
 
 	// Put your setup code here.
 	function site_load() {
 		var checkbox = checkbox_New("mycheckbox");
 		checkbox.checked = true;
 		checkbox.enabled = true;
 		checkbox_Draw(checkbox);
 	}
 
 </script>
 
 _______________________
 HOW THE CONTROL BEHAVES
 
 Once it is set up with it responds to mousedown events automatically.
 You can change the .checked and .enabled field manually.
 A call to 'checkbox_Draw' is required to update the canvas.
 
 For modification of the colors, see the constructor 'checkbox_New'.
 
 The size of the text scales automatically with the height of the canvas.
 
 The mouse input is handled everywhere inside the canvas.
 There is no boundary checking with the round left or right side.
 
 */

// Recommended size: 80x28

// It switches state immediately on mousedown.

// Contructor for the checkbox object.
// Requires an id to the canvas.
function checkbox_New(canvasId) {
	var checkbox = new Object();
	
	checkbox.canvas = document.getElementById(canvasId);
	checkbox.context = checkbox.canvas.getContext("2d");
	
	checkbox.onColor = "black";
	checkbox.offColor = "#CBCBCB";
	checkbox.disabledColor = "#DDDDDD";
	checkbox.textOnColor = "white";
	checkbox.textOffColor = "black";
	checkbox.textDisabledColor = "gray";
	checkbox.enabledBorderColor = "black";
	checkbox.disabledBorderColor = "gray";
	
	checkbox.onText = "ON";
	checkbox.offText = "OFF";
	checkbox.font = "Arial";
	
	checkbox.checked = false;
	checkbox.enabled = true;
	checkbox.isMousedown = false;
	
	// Use closure to tell which check box when handling event.
	checkbox.canvas.onmousedown = function (e) {
		checkbox_mousedown(checkbox,
				e.pageX - checkbox.canvas.offsetLeft,
				e.pageY - checkbox.canvas.offsetTop);
	}
	
	return checkbox;
}

// Change state between on and off.
function checkbox_mousedown(sender, x, y) {
	if (!sender.enabled) return;
	
	sender.checked = !sender.checked;
	
	checkbox_Draw(sender);
}

// Calculates leftmost focal point.
function checkbox_focalPoint1(x, y, w, h) {
	var arr = new Array();
	var radius = h/2;
	
	arr[0] = x + radius;
	arr[1] = y + radius;
	return arr;
}

// Calculates rightmost focal point.
function checkbox_focalPoint2(x, y, w, h) {
	var arr = new Array();
	var radius = h/2;
	
	arr[0] = x + w - radius;
	arr[1] = y + radius;
	return arr;
}

// Draws the silhouette shape of the checkbox.
function checkbox_shape(context, x, y, w, h) {
	var radius = h/2;
	var focalPoint1 = checkbox_focalPoint1(x, y, w, h);
	var focalPoint2 = checkbox_focalPoint2(x, y, w, h);
	
	context.arc(focalPoint1[0], focalPoint1[1], radius,
		    Math.PI/2, 3*Math.PI/2, false);
	context.lineTo(x + w - radius, y);
	context.arc(focalPoint2[0], focalPoint2[1], radius,
		    3*Math.PI/2, 5*Math.PI/2, false);
	context.lineTo(x + radius, h);
}

// Draws a circle.
function checkbox_circle(context, x, y, rad) {
	context.arc(x, y, rad, 0, 2*Math.PI, false);
}

// Draws the checkbox.
function checkbox_Draw(checkbox) {
	var context = checkbox.context;
	var canvas = checkbox.canvas;
	var w = canvas.width;
	var h = canvas.height;
	var backColor = null;
	var sliderPos = checkbox.sliderPos;
	var offsetText = 5;
	var fontSize = h - 2 * offsetText;
	var sliderPos = null;
	
	if (checkbox.checked) {
		sliderPos = checkbox_focalPoint2(0, 0,
			checkbox.canvas.width, checkbox.canvas.height);
	} else {
		sliderPos = checkbox_focalPoint1(0, 0,
			checkbox.canvas.width, checkbox.canvas.height);
	}
	
	if (checkbox.enabled) {
		backColor = checkbox.checked ?
		checkbox.onColor : checkbox.offColor;
	} else {
		backColor = checkbox.disabledColor;
	}
	
	// Draw shape of control.
	context.beginPath();
	context.fillStyle = backColor;
	context.strokeStyle = checkbox.enabled ?
	checkbox.enabledBorderColor : checkbox.disabledBorderColor;
	checkbox_shape(context, 0, 0, w, h);
	context.fill();
	context.stroke();
	
	// Draw text.
	if (checkbox.checked) {
		var text = checkbox.onText;
		context.fillStyle = checkbox.enabled ?
		checkbox.textOnColor : checkbox.textDisabledColor;
		context.font = fontSize + "px " + checkbox.font;
		var metrics = context.measureText(text);
		context.fillText(text, (w - h)/2 - metrics.width/2,
				 h/2 + fontSize/2 - 2);
	} else {
		var text = checkbox.offText;
		context.fillStyle = checkbox.enabled ?
		checkbox.textOffColor : checkbox.textDisabledColor;
		context.font = fontSize + "px " + checkbox.font;
		var metrics = context.measureText(text);
		context.fillText(text, h + (w - h)/2 - metrics.width/2,
				 h/2 + fontSize/2 - 2);
	}
	
	// Draw the circle in front.
	context.beginPath();
	context.strokeStyle = "black";
	checkbox_circle(context, sliderPos[0], sliderPos[1], h/2);
	context.fillStyle = checkbox.offColor;
	context.fill();
	context.stroke();
}

