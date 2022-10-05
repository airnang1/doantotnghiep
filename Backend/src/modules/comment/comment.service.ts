import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { BaseLogger } from '../../core/logger';
import { Comment } from '../../schema/comment.schema';
import { getCommentByVideoId, getVideoByChannel } from '../../youtube';

@Injectable()
export class CommentService extends BaseLogger {
  constructor(@InjectModel(Comment.name) private commentModel: Model<Comment>) {
    super(CommentService.name);
  }

  async createComment(topicId: string, channelId: string) {
    const comments = [];
    let commentNextPage = '';
    let videoNextPage = '';

    for (let i = 0; i < 100; i++) {
      const channelVideos = await getVideoByChannel(channelId, videoNextPage);
      if (channelVideos == null) break;
      channelVideos.items.forEach(async (video) => {
        for (let i = 0; i < 100; i++) {
          const videoComments = await getCommentByVideoId(video.id.videoId, commentNextPage);
          if (videoComments == null) break;

          videoComments.items.forEach((comment) => {
            const content = comment.snippet?.topLevelComment?.snippet?.textDisplay;
            if (content) comments.push({ topicId, channelId, content });
          });
          commentNextPage = videoComments.nextPageToken;
        }
      });

      videoNextPage = channelVideos.nextPageToken;
    }

    await this.commentModel.insertMany(comments);
  }

  async getAllComment(topicId?: string) {
    const where: FilterQuery<Comment> = {};

    if (topicId) where.topicId = topicId;
    return await this.commentModel.find(where);
  }

  async deleteComment(id: string) {
    await this.commentModel.deleteOne({ _id: id });
    return { status: true };
  }
}
