# DaddyRobot-MixPlay-Team-Viewer

This is one of the MixPlay experiences from https://daddyrobot.live/mixplays

You can find the Main Page's code here: https://github.com/tiedyedguy/DaddyRobot-MixPlay-MainPage

### How to copy this

1. Open up the Mixer's CDK program and make a new CDK.
2. Set it to "Custom HTML".
3. Copy all the code from the /src directory here over the /src directory there

### Control to update.

You will need to set the Control Scheme in the CDK to this and upload it:

{
scenes: [
{
controls: [
{
controlID: "team",
kind: "button"
}
],
sceneID: "default"
}
]
}
