<!--
 * @Description: 帮助
 * @Author: sky
 * @Date: 2024-10-08 14:47:18
 * @LastEditTime: 2024-10-29 08:28:34
 * @LastEditors: sky
 1. 使用说明
  1.1. 添加账单图片上传规范
  1.2. 支付宝或微信账单导出指南
 3. 版本日志

-->
<template>
    <div class="card">
        <div class="font-semibold text-2xl mb-4">帮助文档</div>

        <div class="font-semibold text-xl mb-4">支付宝账单导入流程</div>
        <p class="text-lg mb-4">通过下述操作将支付宝账单数据导入到App中</p>
        <ul class="leading-normal list-disc pl-8 text-lg mb-4">
            <li><span class="text-primary font-medium">步骤1</span>: 打开支付宝App，主界面切换到最后一页 "我的"，然后点击 "账单" 条目，跳转到账单页面.</li>
            <li><span class="text-primary font-medium">步骤2</span>: 点击右上角三个点，弹出的菜单，选择 "开具交易交易流水证明"</li>
            <li><span class="text-primary font-medium">步骤3</span>: 选择 "用于个人对账"，点击 "申请" 按钮，会要求输入支付密码</li>
            <li><span class="text-primary font-medium">步骤4</span>: 输入完支付密码后，会让你选择导出账单的一些条件（账单类型，时间范围等，时间范围最大选择一年），然后点击
                "下一步"</li>
            <li><span class="text-primary font-medium">步骤5</span>: 输入你的邮箱，支付宝会给你发一封邮件，邮件附件中会带有账单文件，一般是 .zip 格式的压缩包</li>
            <li><span class="text-primary font-medium">步骤6</span>: 从邮箱下载导出的 .zip 压缩包后，先解压，需要输入压缩密码，密码在支付宝最近信息中查看</li>
            <li><span class="text-primary font-medium">步骤7</span>: 将解压后的 csv 格式文件通过 账单导入 功能导入APP中。"</li>
        </ul>

        <div class="font-semibold text-xl mb-4">微信账单导入流程</div>
        <p class="text-lg mb-4">通过下述操作将微信账单数据导入到App中</p>
        <ul class="leading-normal list-disc pl-8 text-lg mb-4">
            <li><span class="text-primary font-medium">步骤1</span>: 打开微信App，主界面切换到最后一页 "我的"，然后依次点击 "服务->钱包"
                条目，右上角点击账单跳转到账单页面.</li>
            <li><span class="text-primary font-medium">步骤2</span>: 点击右上角常见问题，等列表完全加载完毕，点击 下载账单 选项；</li>
            <li><span class="text-primary font-medium">步骤3</span>: 点击 下载账单，选择 用于个人对账</li>
            <li><span class="text-primary font-medium">步骤4</span>: 根据指引下载账单，会让你选择导出账单的一些条件（账单类型，时间范围等，时间范围最大选择三个月），然后点击
                "下一步"</li>
            <li><span class="text-primary font-medium">步骤5</span>: 输入你的邮箱以及支付密码，微信会给你发一封邮件，邮件附件中会带有账单文件，一般是 .zip 格式的压缩包
            </li>
            <li><span class="text-primary font-medium">步骤6</span>: 从邮箱下载导出的 .zip 压缩包后，先解压，需要输入压缩密码，密码在微信支付公众号查看</li>
            <li><span class="text-primary font-medium">步骤7</span>: 将解压后的 csv 格式文件通过 账单导入 功能导入APP中。"</li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
@media screen and (max-width: 991px) {
    .video-container {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 56.25%;

        iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    }
}
</style>
