#import <UIKit/UIKit.h>
#import <React/RCTBridgeDelegate.h>
#import <UMReactNativeAdapter/UMModuleRegistryAdapter.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate>

@property (nonatomic, strong) UIWindow *window;
@property (nonatomic, strong) UMModuleRegistryAdapter *moduleRegistryAdapter;

@end
