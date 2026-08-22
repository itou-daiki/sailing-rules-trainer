# セーリング・ルール練習帳

高校生・大学生を主な対象に、レース信号旗とセーリング競技規則を状況問題で学ぶWebアプリです。GitHub Pagesで動く静的なReactアプリとして作っています。

## 初版でできること

- レース信号旗16種を「意味」だけでなく「艇上での行動」とセットで確認
- 規則10〜17の基本を、見るポイントと早合点しやすい点に分けて確認
- 信号旗・艇の位置図を見て答える5問練習
- 解答直後に「結論 → 見るポイント → 正式な用語・規則番号」の順で復習
- 間違えた問題と未回答問題を、次の練習で優先
- 学習記録をブラウザ内だけに保存
- スマートフォン、キーボード操作、オフライン利用に対応

## 開発

Node.js 24以上を推奨します。

```bash
npm install
npm run dev
```

品質チェックは次のコマンドで実行します。

```bash
npm run lint
npm test
npm run build
```

`main` ブランチへ反映すると、`.github/workflows/deploy.yml` がテストとビルドを行い、GitHub Pagesへ配信します。リポジトリの Settings → Pages → Source は「GitHub Actions」を選択してください。

## 教材の考え方

このアプリは公式規則集の代わりではなく、判断練習の入口です。規則本文を転載せず、独自の短い説明と図を用い、公式資料へリンクします。大会では必ずレース公示、帆走指示書、適用される公式規則を確認してください。

内容は次の資料を基準に、2026年8月22日に確認しています。

- [World Sailing: Racing Rules of Sailing](https://www.sailing.org/racingrules/) — RRS 2025–2028、2026年4月20日までのChanges and Corrections
- [日本セーリング連盟: 規則・規定](https://www.jsaf.or.jp/hp/about/committee/rule/rule-reg) — 日本語版の正誤表・規則情報
- [World Sailing: ERS & RRS Reproduction Policy 2025–2028](https://www.sailing.org/document/ers-rrs-reproduction-policy-2025-2028/) — オンライン掲載・派生物の扱い

## デザイン原則

- ヨットクラブの練習ボードとレース委員会の信号板を基調にする
- 旗色、マスト、航跡など、競技に意味のある形を使う
- 紫のグラデーション、発光、過度な角丸、意味のない装飾を使わない
- 高校生・大学生向けに、平易だが幼く見えない日本語にする
