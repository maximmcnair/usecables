function recordCanvas(canvas: HTMLCanvasElement, time: number) {
  const recordedChunks: any[] = [];

  return new Promise(function (res, rej) {
    var stream = canvas.captureStream(25 /*fps*/);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm; codecs=vp9'
    });

    mediaRecorder.start(time);

    mediaRecorder.ondataavailable = function (event) {
      recordedChunks.push(event.data);
      // after stop `dataavilable` event run one more time
      if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
    };

    mediaRecorder.onstop = function (event) {
      var blob = new Blob(recordedChunks, {
        type: 'video/webm',
        mimeType: 'video/webm;codecs:vp9'
      });
      var url = URL.createObjectURL(blob);
      res(url);
    };
  });
}

export default async function record(canvas: HTMLCanvasElement) {
  const recording = recordCanvas(canvas, 8000);

  const $video = document.createElement('video');
  document.body.appendChild($video);
  $video.setAttribute('class', 'render-video');
  recording.then((url) => $video.setAttribute('src', url));

  // download it
  const link$ = document.createElement('a');
  link$.setAttribute('download', 'recordingVideo');
  recording.then((url) => {
    link$.setAttribute('href', url);
    link$.click();
  });
}
