import { execSync } from "child_process";

// 使い方: `node .scripts/release.js <version>`
//
// このスクリプトは `git` を使った簡易的なリリース処理を行います:
// 1. 現在のブランチをリモートへ `git push` でプッシュします
// 2. `refs/heads/<version>` の参照を `main` に更新します
// 3. 指定した `<version>` ブランチ/リファレンスを `origin` に強制プッシュします
//
// 注意:
// - 簡潔に同期実行するために `execSync` を使用しています
// - git が返すエラーは可能な限り stdout/stderr とともに出力します

const version = process.argv[2];

if (!version) {
  console.error("使い方: node .scripts/release.js <version>");
  process.exit(1);
}

console.info(`リリース開始: ${version}`);

try {
  // 1) 現在のブランチをプッシュ
  console.info("[step 1/3] git push");
  const pushOut = execSync("git push", { stdio: "pipe" }).toString();
  if (pushOut) console.info("git push 出力:\n", pushOut.trim());

  // 2) refs/heads/<version> を main に合わせて更新
  console.info(
    `[step 2/3] git update-ref refs/heads/${version} refs/heads/main`
  );
  const updateRefCmd = `git update-ref refs/heads/${version} refs/heads/main`;
  const updateOut = execSync(updateRefCmd, { stdio: "pipe" }).toString();
  if (updateOut) console.info(`${updateRefCmd} 出力:\n`, updateOut.trim());

  // 3) 指定バージョンを origin に強制プッシュ
  const pushVersionCmd = `git push origin ${version} --force`;
  console.info("[step 3/3] ", pushVersionCmd);
  const pushVerOut = execSync(pushVersionCmd, { stdio: "pipe" }).toString();
  if (pushVerOut) console.info(`${pushVersionCmd} 出力:\n`, pushVerOut.trim());

  console.info("リリースが正常に完了しました。");
  process.exit(0);
} catch (err) {
  console.error("リリースに失敗しました。");

  // エラーメッセージを出力
  if (err && err.message) console.error("エラー:", err.message);

  // execSync は stdout/stderr を含む Error を投げることがあるため、可能ならそれらも出力する
  try {
    if (err && err.stdout) {
      const s =
        typeof err.stdout === "string" ? err.stdout : err.stdout.toString();
      if (s) console.error("stdout:\n", s.trim());
    }
    if (err && err.stderr) {
      const s =
        typeof err.stderr === "string" ? err.stderr : err.stderr.toString();
      if (s) console.error("stderr:\n", s.trim());
    }
  } catch (inner) {
    // 出力処理での二次的なエラーは無視
  }

  process.exit(1);
}
