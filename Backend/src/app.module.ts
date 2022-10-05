import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from './config';
import { HealthModule } from './health/health.module';
import { AccountModule } from './modules/account/account.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { ChannelModule } from './modules/channel/channel.module';
import { ClientModule } from './modules/client/client.module';
import { CommentModule } from './modules/comment/comment.module';
import { CouponModule } from './modules/coupon/coupon.module';
import { CreditModule } from './modules/credit/credit.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { DeviceModule } from './modules/device/device.module';
import { EventModule } from './modules/event/event.module';
import { FaceBookModule } from './modules/facebook/facebook.module';
import { GroupModule } from './modules/group/group.module';
import { LogModule } from './modules/log/log.module';
import { MailModule } from './modules/mail/mail.module';
import { MobileModule } from './modules/mobile/mobile.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PlaylistModule } from './modules/playlist/playlist.module';
import { ProfileModule } from './modules/profile/profile.module';
import { ProxyModule } from './modules/proxy/proxy.module';
import { ScenarioModule } from './modules/scenario/scenario.module';
import { ServerModule } from './modules/server/server.module';
import { SpotifyModule } from './modules/spotify/spotify.module';
import { VideoModule } from './modules/video/video.module';
import { WebsiteModule } from './modules/website/website.module';
import { YoutubeModule } from './modules/youtube/youtube.module';

const config = ConfigService.getInstance();

@Module({
  imports: [
    MongooseModule.forRoot(config.get('DATABASE_URL'), { dbName: config.get('DATABASE_NAME') }),
    ScenarioModule,
    ChannelModule,
    FaceBookModule,
    WebsiteModule,
    SpotifyModule,
    EventModule,
    DashboardModule,
    CommentModule,
    PlaylistModule,
    VideoModule,
    MobileModule,
    YoutubeModule,
    ClientModule,
    NotificationModule,
    GroupModule,
    MailModule,
    ProxyModule,
    ProfileModule,
    LogModule,
    ServerModule,
    DeviceModule,
    AccountModule,
    CouponModule,
    CreditModule,
    HealthModule,
    AnalyticsModule
  ]
})
export class AppModule {}
