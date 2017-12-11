using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Web;
using Funq;
using ReactChat.ServiceInterface;
using ServiceStack;
using ServiceStack.Auth;
using ServiceStack.Configuration;
using ServiceStack.Razor;
using ServiceStack.Redis;
using ServiceStack.Text;

namespace ReactChat
{
    public class AppHost : AppHostBase
    {
        public AppHost()
            : base("Chat", typeof(ServerEventsServices).Assembly)
        {
            var customSettings = "~/appsettings.txt".MapHostAbsolutePath();
            AppSettings = File.Exists(customSettings)
                ? (IAppSettings)new TextFileSettings(customSettings)
                : new AppSettings();
        }

        public override void Configure(Container container)
        {
            JsConfig.EmitCamelCaseNames = true;

            Plugins.Add(new RazorFormat());
            Plugins.Add(new ServerEventsFeature());

            SetConfig(new HostConfig
            {
                DebugMode = AppSettings.Get("DebugMode", false),
                WebHostPhysicalPath = MapProjectPath("~/wwwroot"),
                DefaultContentType = MimeTypes.Json,
                AddRedirectParamsToQueryString = true,
            });

            this.CustomErrorHttpHandlers.Remove(HttpStatusCode.Forbidden);

            //Register all Authentication methods you want to enable for this web app.            
            Plugins.Add(new AuthFeature(
                () => new AuthUserSession(),
                new IAuthProvider[] {
                    new TwitterAuthProvider(AppSettings),   //Sign-in with Twitter
                    new FacebookAuthProvider(AppSettings),  //Sign-in with Facebook
                    new GithubAuthProvider(AppSettings),    //Sign-in with GitHub OAuth Provider
                }));

            container.RegisterAutoWiredAs<MemoryChatHistory, IChatHistory>();

            var redisHost = AppSettings.GetString("RedisHost");
            if (redisHost != null)
            {
                container.Register<IRedisClientsManager>(new RedisManagerPool(redisHost));

                container.Register<IServerEvents>(c =>
                    new RedisServerEvents(c.Resolve<IRedisClientsManager>()));
                container.Resolve<IServerEvents>().Start();
            }
        }
    }
}