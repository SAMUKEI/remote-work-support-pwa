class Observable {
  constructor() {
    this.event = {};
    return new Proxy(this, {
      set: function (obj, prop, value) {
        if (obj[prop] === value) return true;
        obj[prop] = value;
        if (obj.event[prop + '_onchanged']) {
          obj.event[prop + '_onchanged'].bind(obj)();
        }
        return true;
      }
    });
  }
}

class StatusObservable extends Observable {
  constructor() {
    super();

    // 変更検知
    this.event.leave_onchanged = () => {
      if (this.leave) {
        // 離席
        $('#detect').hide();
        $('#not-detect').show();
        this.slack("離席中", ":samukei:")
      } else {
        // 在席
        $('#detect').show();
        $('#not-detect').hide();
        this.slack("在席中", ":usagi:")
      }
    };
  }

  // Slackへの送信
  // text: 送信するテキスト
  // emoji: 絵文字
  slack(text, emoji) {
    if (!localStorage.getItem("token")) {
      return console.log("please set api token");
    }
    const url = 'https://slack.com/api/users.profile.set';
    const data = {
      "token": localStorage.getItem("token"),
      "profile": JSON.stringify({
        "status_text": text,
        "status_emoji": emoji
      })
    };

    const thiz = this;
    $.ajax({
      type: 'POST',
      url: url,
      data: data,
      success: function (data) {
        if (!data["ok"]) {
          // エラーなので1sec後に再送
          window.setTimeout(thiz.slack(text, emoji), 1000);
        }
      },
      error: function () {
        console.log("エラー")
      }
    });
  }

}

$(function () {
  // 入力の変更によるトークン更新
  $("#token").keyup(function () {
    var token = $("#token").val();
    localStorage.setItem("token", token);
  });
  // トークンを復元
  $("#token").val(localStorage.getItem("token"));

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
      const observable = new StatusObservable();

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
        if (faces.length > 0) {
          observable.leave = false
        } else {
          observable.leave = true
        }
      }
    });
  }

});