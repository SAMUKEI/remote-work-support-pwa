$(function () {

  $('.slack-submit').on('click', function () {
    var url = 'https://slack.com/api/chat.postMessage';
    var data = {
      token: 'あなたのトークン',
      channel: '#general',
      username: 'oreno-bot',
      text: 'Hello Slack!'
    };

    $.ajax({
      type: 'GET',
      url: url,
      data: data,
      success: function (data) {
        alert('Can I post to Slack? :' + data.ok);
      }
    });
  });

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({video: true}).then(function (stream) {
      video.srcObject = stream;
      video.play();

      if (window.FaceDetector == undefined) {
        console.error('Face Detection not supported');
        return;
      }
      const options = {fastMode: true, maxDetectedFaces: 1};
      const faceDetector = new window.FaceDetector(options);
      const imageCapture = new window.ImageCapture(video.srcObject.getVideoTracks()[0]);

      detect();
      async function detect() {
        requestAnimationFrame(detect);

        let img;
        try {
          img = await imageCapture.grabFrame();
        } catch {
          // Sometimes this throws with message `undefined`...
          return;
        }
        const faces = await faceDetector.detect(img).catch(console.error);
        if(faces.length > 0) {
          $('#detect').show();
          $('#not-detect').hide();
        } else {
          $('#detect').hide();
          $('#not-detect').show();
        }

        console.log(faces);
      }
    });
  }

});