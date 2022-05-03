# interactive-live-streamer
- under the pandemic of corona virus, the chance of live-streaming seems to have increased. Howecer, live-streaming is in some ways troublesome. Have to set up cameras, voices, backscrean, etc. This application will support interactive live streaming just by using your web browser.

# Demo

# Features
- [x] P2P for WebRTC
- [ ] SFU for WebRTC
- [ ] screen share
- [ ] realtime comment 
- [ ] realtime reaction (with sound)
- [ ] realtime quationnaire
- [ ] pose-estimation based character controller
- [ ] voice changer
- [ ] text-to-speech
- [ ] speech-to-text
- [ ] ban user 
- [ ] timer
- [ ] playing sound (like piano)
- [ ] custom (plugin)

# TODO
- frontend: error handling.
- backend: XXXXXX. 

# Test Environment
- Google Chrome, ver. 99.0.4844.84（Official Build） （x86_64）

# Required
- set .env file for both of server&client (please refer .env.template file(s).)
- install and allow [direnv](https://github.com/direnv/direnv) for automatically set environment variable based on .env file. (or, manually set environment variables)

# Usage 
## frontend
- run ```npm start``` 
    - ```localhost``` is ok. Please refer to [api](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#privacy_and_security).
    - to enable browser to access camera, microphone, or screen, you must give permission to your browser. Google it.
## backend
    
