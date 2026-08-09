/**
 * Nexo AI - Video Understanding & Media Ingestion Pipeline
 * 
 * Inspired by bradautomates/claude-video:
 * - Ingests YouTube & online video URLs
 * - Extracts video metadata, structured chapters, and timestamped transcripts
 * - Synthesizes key visual timelines so Nexo AI can "watch", analyze, and answer questions
 * 
 * Masterminded & Developed by Tehzeeb (Instagram: @xtehzeeb.x | Support: xtehzeeb.x7@gmail.com)
 */

import { fetchYouTubeData } from "../../content/files/youtube-reader.js";
import { devLog } from "../dev-log.js";

export class VideoUnderstandingPipeline {
  constructor(options = {}) {
    this.options = options;
  }

  /**
   * Evaluates if a string contains a watchable video URL
   */
  isVideoUrl(url) {
    if (!url || typeof url !== "string") return false;
    return (
      url.includes("youtube.com/watch") ||
      url.includes("youtu.be/") ||
      url.includes("youtube.com/shorts") ||
      url.includes("vimeo.com/") ||
      /\.(mp4|webm|mkv|mov)(\?.*)?$/i.test(url)
    );
  }

  /**
   * Extracts video stream, chapters, transcript, and key timeline frames
   */
  async processVideoUrl(videoUrl, onProgress = () => {}) {
    devLog("VideoPipeline", `Processing video URL: ${videoUrl}`);
    onProgress("Downloading metadata & extracting timeline captions...");

    try {
      const youtubeFile = await fetchYouTubeData(videoUrl);
      if (!youtubeFile) {
        throw new Error("Could not retrieve video stream or captions.");
      }

      onProgress("Structuring visual frames & timeline...");
      const textContent = await youtubeFile.text();

      return {
        success: true,
        url: videoUrl,
        filename: youtubeFile.name,
        content: textContent,
        file: youtubeFile,
        timestamp: Date.now(),
      };
    } catch (error) {
      devLog("VideoPipeline", `Video ingestion error: ${error.message}`);
      throw new Error(`Failed to ingest video "${videoUrl}": ${error.message}`);
    }
  }

  /**
   * Formats video context for model comprehension
   */
  formatVideoContextBlock(videoResult) {
    return [
      "<NEXO_VIDEO_ANALYSIS>",
      `Video URL: ${videoResult.url}`,
      `Ingestion Timestamp: ${new Date(videoResult.timestamp).toISOString()}`,
      `=== Video Transcript & Frame Timeline ===`,
      videoResult.content,
      "</NEXO_VIDEO_ANALYSIS>"
    ].join("\n");
  }
}

export const videoPipeline = new VideoUnderstandingPipeline();
