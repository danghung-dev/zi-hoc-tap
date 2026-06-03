    // ==========================================
    // --- N4 15群の文法データ定義 / 15 Grammar Groups ---
    // ==========================================
    const grammarGroups = [
      {
        id: 1,
        name: "1. Cho – Nhận – Nhờ",
        priority: "Cực kì quan trọng (Đặc biệt hay ra)",
        summary: "Dễ sai ở hướng đi của hành động dựa vào Trợ từ.",
        details: `
          <div class="space-y-3">
            <p>Sự phân chia hướng hành động dựa trên <strong>Chủ ngữ</strong> và <strong>Trợ từ</strong>:</p>
            <div class="grid grid-cols-1 gap-2">
              <div class="bg-slate-950 p-2.5 rounded border border-slate-800 text-xs">
                <span class="text-amber-400 font-bold">～てあげる</span>: Mình/phía mình làm cho người khác (Chủ ngữ là <strong>Tôi</strong>).
                <br><span class="text-slate-500">VD: 私は友だちに日本語を教えてあげました。</span>
              </div>
              <div class="bg-slate-950 p-2.5 rounded border border-slate-800 text-xs">
                <span class="text-emerald-400 font-bold">～てくれる</span>: Người khác làm cho mình (Người nhận là <strong>Tôi / Phía tôi</strong>, Chủ ngữ là người thực hiện).
                <br><span class="text-slate-500">VD: 友だちが手伝ってくれました。</span>
              </div>
              <div class="bg-slate-950 p-2.5 rounded border border-slate-800 text-xs">
                <span class="text-indigo-400 font-bold">～てもらう</span>: Mình được/nhờ ai đó làm cho (Chủ ngữ là <strong>Tôi / Người nhận lợi ích</strong>, người làm đi với trợ từ <strong>に</strong>).
                <br><span class="text-slate-500">VD: 先生に作文を見てもらいました。</span>
              </div>
            </div>
            <div class="bg-rose-950/30 border border-rose-900/50 p-3 rounded text-xs text-rose-300">
              <strong>Bẫy chí mạng:</strong> Đề thi thường đục lỗ ở trợ từ <strong>が</strong> hoặc <strong>に</strong> trước tên người để bạn suy đoán chọn <code>くれる</code> hay <code>もらう</code>!
            </div>
          </div>
        `
      },
      {
        id: 2,
        name: "2. Thể hiện ý muốn",
        priority: "Rất dễ ra",
        summary: "Phân biệt mong muốn bản thân và người khác.",
        details: `
          <div class="space-y-3">
            <ul class="list-disc pl-4 space-y-1.5 text-xs text-slate-300">
              <li><strong>～がほしい</strong>: Muốn có cái gì (Danh từ + が + ほしい). Chỉ dùng cho ngôi thứ nhất (Tôi).</li>
              <li><strong>～たい</strong>: Muốn làm gì (Vます + たい). Chỉ dùng cho ngôi thứ nhất.</li>
              <li><strong>～たがる</strong>: Người khác muốn làm gì (Vます + たがる). Chuyển trợ từ <span class="text-rose-400">を -> が thành を</span>.
                <br><span class="text-slate-500">VD: 弟はゲームをしたがっています。</span></li>
              <li><strong>～てほしい</strong>: Mình muốn người khác làm gì đó (Nに + Vて + ほしい).
                <br><span class="text-slate-500">VD: 先生に日本語で話してほしいです。</span></li>
            </ul>
          </div>
        `
      },
      {
        id: 3,
        name: "3. Thể Điều kiện",
        priority: "Đặc biệt hay ra (Chắc chắn có)",
        summary: "Phân biệt 4 mẫu たら, ば, と, なら.",
        details: `
          <div class="space-y-3">
            <p class="text-xs text-slate-300">N4 có 4 mẫu điều kiện dễ gây nhiễu:</p>
            <div class="grid grid-cols-1 gap-2 text-xs">
              <div class="bg-slate-950 p-2 rounded">
                <strong class="text-indigo-400">～たら</strong>: Dùng rộng nhất (Nếu/Sau khi). Có thể đi với ý chí, mệnh lệnh ở vế sau.
              </div>
              <div class="bg-slate-950 p-2 rounded">
                <strong class="text-indigo-400">～ば</strong>: Giả định logic, trang trọng. Vế sau không đi với ý chí/mệnh lệnh trừ khi trạng thái.
              </div>
              <div class="bg-slate-950 p-2 rounded">
                <strong class="text-indigo-400">と (Cứ hễ)</strong>: Quy luật tự nhiên, máy móc, thói quen bất biến. Vế sau TUYỆT ĐỐI không có ý chí, rủ rê.
              </div>
              <div class="bg-slate-950 p-2 rounded">
                <strong class="text-indigo-400">なら</strong>: Nếu là... (Đưa ra lời khuyên dựa trên lời của đối phương).
              </div>
            </div>
          </div>
        `
      },
      {
        id: 4,
        name: "4. Dù... cũng... & Mặc dù...",
        priority: "Trung bình",
        summary: "Trái ngược logic và cảm xúc tiếc nuối.",
        details: `
          <div class="space-y-2 text-xs text-slate-300">
            <p><strong>～ても (Dù... vẫn...)</strong>: Biểu thị điều kiện ngược mang tính trung lập, hiển nhiên.</p>
            <p><strong>～のに (Mặc dù... vậy mà...)</strong>: Thể hiện sự bất ngờ, thất vọng, tiếc nuối hoặc bất mãn của người nói.</p>
            <div class="bg-rose-950/20 border border-rose-900/40 p-2.5 rounded text-rose-300 text-[11px]">
              Vế sau của <code>のに</code> không bao giờ là câu mệnh lệnh, rủ rê hay ý chí chủ quan!
            </div>
          </div>
        `
      },
      {
        id: 5,
        name: "5. Thể Phỏng đoán",
        priority: "Cực kì quan trọng",
        summary: "Nghe nói vs Trông có vẻ (Bẫyそうです).",
        details: `
          <div class="space-y-3 text-xs text-slate-300">
            <div class="bg-slate-950 p-2.5 rounded border border-indigo-950">
              <span class="text-indigo-400 font-bold">そうです (Nghe nói)</span>: Đi với thể thông thường (普通形).
              <br><span class="text-emerald-400">VD: 雨が降るそうです (Nghe dự báo nói mai mưa).</span>
            </div>
            <div class="bg-slate-950 p-2.5 rounded border border-indigo-950">
              <span class="text-indigo-400 font-bold">そうです (Trông có vẻ)</span>: Đi với Vます bỏ ます, Tính từ い bỏ い, Tính từ な giữ nguyên.
              <br><span class="text-emerald-400">VD: 雨が降りそうです (Trông mây đen sắp mưa tới nơi).</span>
            </div>
            <p><strong>～かもしれない</strong>: Có lẽ (Mức độ chắc chắn thấp, khoảng 50%).</p>
            <p><strong>～はずです</strong>: Chắc chắn là (Độ tin cậy cao dựa trên chứng cứ logic thực tế).</p>
          </div>
        `
      },
      {
        id: 6,
        name: "6. Trạng thái hành động",
        priority: "Quan trọng đọc hiểu",
        summary: "Lập kế hoạch vs Kết quả có sẵn (ておく vs てある).",
        details: `
          <div class="space-y-3 text-xs">
            <div class="bg-slate-950 p-2.5 rounded border border-slate-800">
              <span class="text-indigo-400 font-bold">～ておく (Làm sẵn chuẩn bị)</span>: Động từ chủ động do con người thực hiện trước một thời điểm.
              <br><span class="text-slate-500">VD: 旅行の前に切符を買っておきます。</span>
            </div>
            <div class="bg-slate-950 p-2.5 rounded border border-slate-800">
              <span class="text-indigo-400 font-bold">～てある (Đã được làm sẵn)</span>: Trạng thái của đồ vật sau khi được tác động chủ ý, đi với tha động từ trợ từ <span class="text-rose-400">が</span>.
              <br><span class="text-slate-500">VD: 壁にカレンダーがはってあります。</span>
            </div>
          </div>
        `
      },
      {
        id: 7,
        name: "7. Bị động - Sai khiến",
        priority: "Rất quan trọng trong nghe hiểu",
        summary: "Bắt làm, cho phép làm và bị bắt làm.",
        details: `
          <div class="space-y-3 text-xs text-slate-300">
            <p><strong>～させる (Sai khiến)</strong>: Bắt ai đó làm hoặc cho phép làm.</p>
            <p><strong>～させられる (Bị động sai khiến)</strong>: Bị người khác bắt phải làm điều mình không muốn.</p>
            <p><strong>～られる (Bị động)</strong>: Bị tác động bởi hành động của ai đó (Người thực hiện hành động đi với <code>に</code>).</p>
          </div>
        `
      },
      {
        id: 8,
        name: "8. Ý chí & Quyết định",
        priority: "Hay ra trong câu hội thoại",
        summary: "Cách rủ rê thân mật và bày tỏ quyết định.",
        details: `
          <div class="space-y-2 text-xs text-slate-300">
            <p><strong>～なさい</strong>: Mệnh lệnh nhẹ nhàng (Người trên bảo người dưới, bố mẹ dạy con).</p>
            <p><strong>～よう / ～おう (Thể ý chí)</strong>: Thân mật của <code>～ましょう</code> (Cùng làm nào!).</p>
            <p><strong>～ことにする</strong>: Quyết định của bản thân (Tôi quyết định làm việc X).</p>
          </div>
        `
      },
      {
        id: 9,
        name: "9. Dễ – Khó làm gì",
        priority: "Dễ lấy điểm",
        summary: "Phép cộng đuôi tính từ vào động từ.",
        details: `
          <div class="space-y-2 text-xs text-slate-300">
            <p>Công thức: <strong>Vます (bỏ ます) + やすい / にくい</strong></p>
            <p>Cụm từ tạo thành sẽ được chia và biến đổi như một <strong>Tính từ đuôi い</strong>.</p>
            <p><span class="text-slate-500">VD: このペンは書きやすいです。 (Cây bút này dễ viết).</span></p>
          </div>
        `
      },
      {
        id: 10,
        name: "10. Phủ định & Hạn chế",
        priority: "Hay bẫy",
        summary: "Phân biệt Chỉ (だけ vs しか...ない).",
        details: `
          <div class="space-y-3 text-xs text-slate-300">
            <p><strong>～なくてもいい</strong>: Không làm cũng được (Cho phép phủ định).</p>
            <p><strong>～ないで</strong>: Đừng làm gì đó / Không làm việc A mà làm việc B.</p>
            <div class="bg-slate-950 p-2 rounded">
              <span class="text-rose-400 font-bold">Bẫy lớn (だけ vs しか)</span>:
              <br>• <strong>だけ</strong> đi với khẳng định.
              <br>• <strong>しか</strong> bắt buộc đi với động từ phủ định ở cuối câu (<strong>～ない</strong>).
            </div>
          </div>
        `
      },
      {
        id: 11,
        name: "11. So sánh giống như",
        priority: "Trung bình",
        summary: "Phân biệt trợ từ và cách nối từ sau みたい, よう.",
        details: `
          <div class="space-y-2 text-xs text-slate-300">
            <p><strong>～みたい</strong>: Giống như (Dùng nhiều trong văn nói, không cần の).</p>
            <p><strong>～のような + Danh từ</strong>: So sánh ví von như là...</p>
            <p><strong>～のように + Động từ/Tính từ</strong>: Làm gì đó theo cách giống như...</p>
          </div>
        `
      },
      {
        id: 12,
        name: "12. Hối tiếc & May mắn",
        priority: "Dễ sai vế chia",
        summary: "Cảm xúc hối tiếc và cảm ơn chân thành.",
        details: `
          <div class="space-y-2 text-xs text-slate-300">
            <p><strong>～てすみません</strong>: Thành thật xin lỗi vì đã...</p>
            <p><strong>～てよかった</strong>: Thật may vì đã làm việc đó.</p>
            <p><strong>～ばよかった</strong>: Giá mà/Lẽ ra nên làm (Thể hiện sự hối tiếc, thực tế đã không làm).</p>
          </div>
        `
      },
      {
        id: 13,
        name: "13. Hành động song song",
        priority: "Hay gặp",
        summary: "Vừa làm vừa làm, thử nghiệm.",
        details: `
          <div class="space-y-2 text-xs text-slate-300">
            <p><strong>～てみる</strong>: Thử làm hành động nào đó lần đầu.</p>
            <p><strong>～ながら (Vừa... vừa...)</strong>: Hai hành động diễn ra song song. Hành động vế sau là hành động chính (V1ます bỏ ます + ながら + V2).</p>
            <p><strong>～ているあいだに</strong>: Trong lúc trạng thái đang diễn ra thì một hành động khác xen vào đột ngột.</p>
          </div>
        `
      },
      {
        id: 14,
        name: "14. Làm biến đổi trạng thái",
        priority: "Hay ra trong ngữ pháp sơ cấp",
        summary: "Chủ động tác động thay đổi sự vật.",
        details: `
          <div class="space-y-2 text-xs text-slate-300">
            <p><strong>Tính từ い (bỏ い) + くする</strong>: Làm cho trở nên...</p>
            <p><strong>Tính từ な / Danh từ + にする</strong>: Làm cho trở nên...</p>
            <p><span class="text-slate-500">VD: 部屋をきれいにします (Dọn phòng sạch sẽ).</span></p>
          </div>
        `
      },
      {
        id: 15,
        name: "15. Hỏi gián tiếp",
        priority: "Dễ bẫy thể chia",
        summary: "Lồng câu hỏi vào trong câu kể.",
        details: `
          <div class="space-y-2 text-xs text-slate-300">
            <p><strong>～かどうか</strong>: Có... hay là không (Lồng câu hỏi không có từ để hỏi vào câu lớn).</p>
            <p><strong>～という～</strong>: Cái được gọi là... (Định nghĩa, giới thiệu tên gọi).</p>
          </div>
        `
      }
    ];

    // --- 150 Trắc nghiệm Ngữ pháp N4: 10 câu cho mỗi nhóm ---
    const grammarQuestions = [
      {
            "id": "g1_01",
            "groupId": 1,
            "question": "私は友だち（　）日本語を教えてあげました。",
            "translation": "Tôi dạy tiếng Nhật cho bạn.",
            "options": [
                  "が",
                  "に",
                  "を",
                  "で"
            ],
            "answer": 1,
            "explanation": "Nhìn trợ từ và hướng lợi ích: あげる = mình làm cho người khác, くれる = người khác làm cho mình, もらう = mình được/nhờ ai làm."
      },
      {
            "id": "g1_02",
            "groupId": 1,
            "question": "母が私にケーキを作って（　）。",
            "translation": "Mẹ làm bánh cho tôi.",
            "options": [
                  "あげました",
                  "くれました",
                  "もらいました",
                  "しました"
            ],
            "answer": 1,
            "explanation": "Nhìn trợ từ và hướng lợi ích: あげる = mình làm cho người khác, くれる = người khác làm cho mình, もらう = mình được/nhờ ai làm."
      },
      {
            "id": "g1_03",
            "groupId": 1,
            "question": "私は先生（　）作文を直してもらいました。",
            "translation": "Tôi được thầy/cô sửa bài văn cho.",
            "options": [
                  "が",
                  "を",
                  "に",
                  "で"
            ],
            "answer": 2,
            "explanation": "Nhìn trợ từ và hướng lợi ích: あげる = mình làm cho người khác, くれる = người khác làm cho mình, もらう = mình được/nhờ ai làm."
      },
      {
            "id": "g1_04",
            "groupId": 1,
            "question": "妹は私に本を読んで（　）。",
            "translation": "Em gái đọc sách cho tôi.",
            "options": [
                  "くれました",
                  "あげました",
                  "もらいました",
                  "ほしいです"
            ],
            "answer": 0,
            "explanation": "Nhìn trợ từ và hướng lợi ích: あげる = mình làm cho người khác, くれる = người khác làm cho mình, もらう = mình được/nhờ ai làm."
      },
      {
            "id": "g1_05",
            "groupId": 1,
            "question": "私は弟に宿題を手伝って（　）。",
            "translation": "Tôi giúp em trai làm bài tập.",
            "options": [
                  "くれました",
                  "いました",
                  "あげました",
                  "いただきました"
            ],
            "answer": 2,
            "explanation": "Nhìn trợ từ và hướng lợi ích: あげる = mình làm cho người khác, くれる = người khác làm cho mình, もらう = mình được/nhờ ai làm."
      },
      {
            "id": "g1_06",
            "groupId": 1,
            "question": "山田さんは私のかばんを持って（　）。",
            "translation": "Anh Yamada xách cặp giúp tôi.",
            "options": [
                  "あげました",
                  "くれました",
                  "もらいました",
                  "しました"
            ],
            "answer": 1,
            "explanation": "Nhìn trợ từ và hướng lợi ích: あげる = mình làm cho người khác, くれる = người khác làm cho mình, もらう = mình được/nhờ ai làm."
      },
      {
            "id": "g1_07",
            "groupId": 1,
            "question": "私は友だちに駅まで送って（　）。",
            "translation": "Tôi được bạn đưa/tiễn đến ga.",
            "options": [
                  "いました",
                  "くれました",
                  "もらいました",
                  "くださいました"
            ],
            "answer": 2,
            "explanation": "Nhìn trợ từ và hướng lợi ích: あげる = mình làm cho người khác, くれる = người khác làm cho mình, もらう = mình được/nhờ ai làm."
      },
      {
            "id": "g1_08",
            "groupId": 1,
            "question": "先生が漢字の読み方を教えて（　）。",
            "translation": "Thầy/cô chỉ cho tôi cách đọc Kanji.",
            "options": [
                  "くれました",
                  "あげました",
                  "もらいました",
                  "やりました"
            ],
            "answer": 0,
            "explanation": "Nhìn trợ từ và hướng lợi ích: あげる = mình làm cho người khác, くれる = người khác làm cho mình, もらう = mình được/nhờ ai làm."
      },
      {
            "id": "g1_09",
            "groupId": 1,
            "question": "私は友だちの写真を撮って（　）。",
            "translation": "Tôi chụp ảnh cho bạn.",
            "options": [
                  "くれました",
                  "いました",
                  "あげました",
                  "ほしがりました"
            ],
            "answer": 2,
            "explanation": "Nhìn trợ từ và hướng lợi ích: あげる = mình làm cho người khác, くれる = người khác làm cho mình, もらう = mình được/nhờ ai làm."
      },
      {
            "id": "g1_10",
            "groupId": 1,
            "question": "兄に自転車を直して（　）ました。",
            "translation": "Tôi nhờ/được anh trai sửa xe đạp cho.",
            "options": [
                  "いき",
                  "くれ",
                  "もらい",
                  "し"
            ],
            "answer": 2,
            "explanation": "Nhìn trợ từ và hướng lợi ích: あげる = mình làm cho người khác, くれる = người khác làm cho mình, もらう = mình được/nhờ ai làm."
      },
      {
            "id": "g2_01",
            "groupId": 2,
            "question": "私は新しいかばん（　）ほしいです。",
            "translation": "Tôi muốn có cặp mới.",
            "options": [
                  "を",
                  "が",
                  "に",
                  "で"
            ],
            "answer": 1,
            "explanation": "Muốn có: Nがほしい. Muốn làm: Vます bỏ ます + たい. Người thứ ba muốn: たがる/ほしがる. Muốn ai làm: Vてほしい."
      },
      {
            "id": "g2_02",
            "groupId": 2,
            "question": "週末、映画を見（　）です。",
            "translation": "Cuối tuần tôi muốn xem phim.",
            "options": [
                  "たい",
                  "たがる",
                  "ほしい",
                  "たいがる"
            ],
            "answer": 0,
            "explanation": "Muốn có: Nがほしい. Muốn làm: Vます bỏ ます + たい. Người thứ ba muốn: たがる/ほしがる. Muốn ai làm: Vてほしい."
      },
      {
            "id": "g2_03",
            "groupId": 2,
            "question": "弟は外で遊び（　）います。",
            "translation": "Em trai tôi đang muốn chơi bên ngoài.",
            "options": [
                  "たい",
                  "たくて",
                  "たがって",
                  "ほしくて"
            ],
            "answer": 2,
            "explanation": "Muốn có: Nがほしい. Muốn làm: Vます bỏ ます + たい. Người thứ ba muốn: たがる/ほしがる. Muốn ai làm: Vてほしい."
      },
      {
            "id": "g2_04",
            "groupId": 2,
            "question": "私は先生にもう一度説明して（　）です。",
            "translation": "Tôi muốn thầy/cô giải thích lại.",
            "options": [
                  "たい",
                  "ほしい",
                  "たがる",
                  "あげたい"
            ],
            "answer": 1,
            "explanation": "Muốn có: Nがほしい. Muốn làm: Vます bỏ ます + たい. Người thứ ba muốn: たがる/ほしがる. Muốn ai làm: Vてほしい."
      },
      {
            "id": "g2_05",
            "groupId": 2,
            "question": "水が飲み（　）です。",
            "translation": "Tôi muốn uống nước.",
            "options": [
                  "ほしい",
                  "たい",
                  "たがる",
                  "ほしがる"
            ],
            "answer": 1,
            "explanation": "Muốn có: Nがほしい. Muốn làm: Vます bỏ ます + たい. Người thứ ba muốn: たがる/ほしがる. Muốn ai làm: Vてほしい."
      },
      {
            "id": "g2_06",
            "groupId": 2,
            "question": "子どもはおもちゃを（　）がっています。",
            "translation": "Đứa trẻ đang muốn có đồ chơi.",
            "options": [
                  "ほしい",
                  "ほし",
                  "ほしがり",
                  "ほしがって"
            ],
            "answer": 1,
            "explanation": "Muốn có: Nがほしい. Muốn làm: Vます bỏ ます + たい. Người thứ ba muốn: たがる/ほしがる. Muốn ai làm: Vてほしい."
      },
      {
            "id": "g2_07",
            "groupId": 2,
            "question": "私は日本へ行き（　）と思っています。",
            "translation": "Tôi nghĩ là tôi muốn đi Nhật.",
            "options": [
                  "たい",
                  "たがる",
                  "ほしい",
                  "よう"
            ],
            "answer": 0,
            "explanation": "Muốn có: Nがほしい. Muốn làm: Vます bỏ ます + たい. Người thứ ba muốn: たがる/ほしがる. Muốn ai làm: Vてほしい."
      },
      {
            "id": "g2_08",
            "groupId": 2,
            "question": "母に早く帰って（　）です。",
            "translation": "Tôi muốn mẹ về sớm.",
            "options": [
                  "たい",
                  "ほしい",
                  "たがる",
                  "ほしがる"
            ],
            "answer": 1,
            "explanation": "Muốn có: Nがほしい. Muốn làm: Vます bỏ ます + たい. Người thứ ba muốn: たがる/ほしがる. Muốn ai làm: Vてほしい."
      },
      {
            "id": "g2_09",
            "groupId": 2,
            "question": "友だちは日本語を勉強し（　）と言っています。",
            "translation": "Bạn tôi nói muốn học tiếng Nhật.",
            "options": [
                  "たい",
                  "たがる",
                  "ほしい",
                  "ほしがる"
            ],
            "answer": 0,
            "explanation": "Muốn có: Nがほしい. Muốn làm: Vます bỏ ます + たい. Người thứ ba muốn: たがる/ほしがる. Muốn ai làm: Vてほしい."
      },
      {
            "id": "g2_10",
            "groupId": 2,
            "question": "私は時間（　）ほしいです。",
            "translation": "Tôi muốn có thời gian.",
            "options": [
                  "を",
                  "に",
                  "が",
                  "で"
            ],
            "answer": 2,
            "explanation": "Muốn có: Nがほしい. Muốn làm: Vます bỏ ます + たい. Người thứ ba muốn: たがる/ほしがる. Muốn ai làm: Vてほしい."
      },
      {
            "id": "g3_01",
            "groupId": 3,
            "question": "ボタンを押す（　）、ドアが開きます。",
            "translation": "Bấm nút thì cửa mở.",
            "options": [
                  "なら",
                  "と",
                  "たら",
                  "ても"
            ],
            "answer": 1,
            "explanation": "たら dùng rộng và được với ý chí/yêu cầu; と dùng cho quy luật/tự động; ば là điều kiện logic; なら dùng khi đưa lời khuyên theo chủ đề."
      },
      {
            "id": "g3_02",
            "groupId": 3,
            "question": "時間があっ（　）、一緒に映画を見ましょう。",
            "translation": "Nếu có thời gian thì cùng xem phim.",
            "options": [
                  "たら",
                  "と",
                  "なら",
                  "ば"
            ],
            "answer": 0,
            "explanation": "たら dùng rộng và được với ý chí/yêu cầu; と dùng cho quy luật/tự động; ば là điều kiện logic; なら dùng khi đưa lời khuyên theo chủ đề."
      },
      {
            "id": "g3_03",
            "groupId": 3,
            "question": "安けれ（　）、このカメラを買います。",
            "translation": "Nếu rẻ thì tôi mua máy ảnh này.",
            "options": [
                  "と",
                  "ば",
                  "たら",
                  "なら"
            ],
            "answer": 1,
            "explanation": "たら dùng rộng và được với ý chí/yêu cầu; と dùng cho quy luật/tự động; ば là điều kiện logic; なら dùng khi đưa lời khuyên theo chủ đề."
      },
      {
            "id": "g3_04",
            "groupId": 3,
            "question": "日本語を勉強する（　）、この本がいいですよ。",
            "translation": "Nếu học tiếng Nhật thì cuốn này tốt.",
            "options": [
                  "と",
                  "たら",
                  "なら",
                  "ても"
            ],
            "answer": 2,
            "explanation": "たら dùng rộng và được với ý chí/yêu cầu; と dùng cho quy luật/tự động; ば là điều kiện logic; なら dùng khi đưa lời khuyên theo chủ đề."
      },
      {
            "id": "g3_05",
            "groupId": 3,
            "question": "駅に着い（　）、電話してください。",
            "translation": "Khi đến ga thì hãy gọi điện.",
            "options": [
                  "たら",
                  "と",
                  "ば",
                  "なら"
            ],
            "answer": 0,
            "explanation": "たら dùng rộng và được với ý chí/yêu cầu; と dùng cho quy luật/tự động; ば là điều kiện logic; なら dùng khi đưa lời khuyên theo chủ đề."
      },
      {
            "id": "g3_06",
            "groupId": 3,
            "question": "春になる（　）、暖かくなります。",
            "translation": "Hễ xuân đến thì trời ấm.",
            "options": [
                  "たら",
                  "なら",
                  "と",
                  "ても"
            ],
            "answer": 2,
            "explanation": "たら dùng rộng và được với ý chí/yêu cầu; と dùng cho quy luật/tự động; ば là điều kiện logic; なら dùng khi đưa lời khuyên theo chủ đề."
      },
      {
            "id": "g3_07",
            "groupId": 3,
            "question": "分からなけれ（　）、先生に聞いてください。",
            "translation": "Nếu không hiểu hãy hỏi thầy/cô.",
            "options": [
                  "ば",
                  "たら",
                  "と",
                  "なら"
            ],
            "answer": 0,
            "explanation": "たら dùng rộng và được với ý chí/yêu cầu; と dùng cho quy luật/tự động; ば là điều kiện logic; なら dùng khi đưa lời khuyên theo chủ đề."
      },
      {
            "id": "g3_08",
            "groupId": 3,
            "question": "雨が降っ（　）、出かけません。",
            "translation": "Nếu trời mưa tôi không ra ngoài.",
            "options": [
                  "と",
                  "たら",
                  "なら",
                  "ば"
            ],
            "answer": 1,
            "explanation": "たら dùng rộng và được với ý chí/yêu cầu; と dùng cho quy luật/tự động; ば là điều kiện logic; なら dùng khi đưa lời khuyên theo chủ đề."
      },
      {
            "id": "g3_09",
            "groupId": 3,
            "question": "右へ曲がる（　）、銀行があります。",
            "translation": "Rẽ phải thì có ngân hàng.",
            "options": [
                  "なら",
                  "たら",
                  "ば",
                  "と"
            ],
            "answer": 3,
            "explanation": "たら dùng rộng và được với ý chí/yêu cầu; と dùng cho quy luật/tự động; ば là điều kiện logic; なら dùng khi đưa lời khuyên theo chủ đề."
      },
      {
            "id": "g3_10",
            "groupId": 3,
            "question": "暑けれ（　）、エアコンをつけてください。",
            "translation": "Nếu nóng hãy bật điều hòa.",
            "options": [
                  "ば",
                  "と",
                  "なら",
                  "ても"
            ],
            "answer": 0,
            "explanation": "たら dùng rộng và được với ý chí/yêu cầu; と dùng cho quy luật/tự động; ば là điều kiện logic; なら dùng khi đưa lời khuyên theo chủ đề."
      },
      {
            "id": "g4_01",
            "groupId": 4,
            "question": "高く（　）、この靴を買いたいです。",
            "translation": "Dù đắt tôi vẫn muốn mua giày.",
            "options": [
                  "のに",
                  "ても",
                  "から",
                  "なら"
            ],
            "answer": 1,
            "explanation": "ても = dù... cũng...; のに = mặc dù... vậy mà..., thường có cảm xúc tiếc nuối/bất ngờ/bất mãn."
      },
      {
            "id": "g4_02",
            "groupId": 4,
            "question": "薬を飲んだ（　）、まだ頭が痛いです。",
            "translation": "Mặc dù uống thuốc rồi, đầu vẫn đau.",
            "options": [
                  "ても",
                  "のに",
                  "から",
                  "なら"
            ],
            "answer": 1,
            "explanation": "ても = dù... cũng...; のに = mặc dù... vậy mà..., thường có cảm xúc tiếc nuối/bất ngờ/bất mãn."
      },
      {
            "id": "g4_03",
            "groupId": 4,
            "question": "忙しく（　）、毎日日本語を勉強します。",
            "translation": "Dù bận tôi vẫn học tiếng Nhật mỗi ngày.",
            "options": [
                  "ても",
                  "のに",
                  "から",
                  "ので"
            ],
            "answer": 0,
            "explanation": "ても = dù... cũng...; のに = mặc dù... vậy mà..., thường có cảm xúc tiếc nuối/bất ngờ/bất mãn."
      },
      {
            "id": "g4_04",
            "groupId": 4,
            "question": "今日は日曜日な（　）、学校へ行かなければなりません。",
            "translation": "Mặc dù Chủ nhật, tôi vẫn phải đến trường.",
            "options": [
                  "ても",
                  "のに",
                  "から",
                  "なら"
            ],
            "answer": 1,
            "explanation": "ても = dù... cũng...; のに = mặc dù... vậy mà..., thường có cảm xúc tiếc nuối/bất ngờ/bất mãn."
      },
      {
            "id": "g4_05",
            "groupId": 4,
            "question": "雨が降って（　）、試合はあります。",
            "translation": "Dù mưa, trận đấu vẫn diễn ra.",
            "options": [
                  "も",
                  "のに",
                  "から",
                  "なら"
            ],
            "answer": 0,
            "explanation": "ても = dù... cũng...; のに = mặc dù... vậy mà..., thường có cảm xúc tiếc nuối/bất ngờ/bất mãn."
      },
      {
            "id": "g4_06",
            "groupId": 4,
            "question": "日本に三年住んでいる（　）、日本語が上手ではありません。",
            "translation": "Mặc dù sống ở Nhật 3 năm nhưng tiếng Nhật không giỏi.",
            "options": [
                  "ても",
                  "のに",
                  "から",
                  "なら"
            ],
            "answer": 1,
            "explanation": "ても = dù... cũng...; のに = mặc dù... vậy mà..., thường có cảm xúc tiếc nuối/bất ngờ/bất mãn."
      },
      {
            "id": "g4_07",
            "groupId": 4,
            "question": "この仕事は大変（　）、楽しいです。",
            "translation": "Công việc này dù vất vả nhưng vui.",
            "options": [
                  "でも",
                  "のに",
                  "から",
                  "なら"
            ],
            "answer": 0,
            "explanation": "ても = dù... cũng...; のに = mặc dù... vậy mà..., thường có cảm xúc tiếc nuối/bất ngờ/bất mãn."
      },
      {
            "id": "g4_08",
            "groupId": 4,
            "question": "早く起きた（　）、電車に遅れました。",
            "translation": "Dậy sớm nhưng vẫn trễ tàu.",
            "options": [
                  "ても",
                  "のに",
                  "なら",
                  "から"
            ],
            "answer": 1,
            "explanation": "ても = dù... cũng...; のに = mặc dù... vậy mà..., thường có cảm xúc tiếc nuối/bất ngờ/bất mãn."
      },
      {
            "id": "g4_09",
            "groupId": 4,
            "question": "何回読んで（　）、分かりません。",
            "translation": "Dù đọc bao nhiêu lần vẫn không hiểu.",
            "options": [
                  "も",
                  "のに",
                  "から",
                  "なら"
            ],
            "answer": 0,
            "explanation": "ても = dù... cũng...; のに = mặc dù... vậy mà..., thường có cảm xúc tiếc nuối/bất ngờ/bất mãn."
      },
      {
            "id": "g4_10",
            "groupId": 4,
            "question": "静かにしている（　）、先生に注意されました。",
            "translation": "Mặc dù yên lặng mà vẫn bị nhắc.",
            "options": [
                  "ても",
                  "のに",
                  "から",
                  "なら"
            ],
            "answer": 1,
            "explanation": "ても = dù... cũng...; のに = mặc dù... vậy mà..., thường có cảm xúc tiếc nuối/bất ngờ/bất mãn."
      },
      {
            "id": "g5_01",
            "groupId": 5,
            "question": "このケーキはおいし（　）そうです。",
            "translation": "Bánh này trông có vẻ ngon.",
            "options": [
                  "い",
                  "く",
                  "な",
                  ""
            ],
            "answer": 3,
            "explanation": "そうです có 2 loại: nghe nói = thể thường + そう; trông có vẻ = Vます bỏ ます / Aい bỏ い + そう. かもしれない = có lẽ; はず = chắc theo logic."
      },
      {
            "id": "g5_02",
            "groupId": 5,
            "question": "ニュースによると、明日は雪が降る（　）です。",
            "translation": "Theo tin tức, nghe nói mai tuyết rơi.",
            "options": [
                  "そう",
                  "たい",
                  "たら",
                  "ない"
            ],
            "answer": 0,
            "explanation": "そうです có 2 loại: nghe nói = thể thường + そう; trông có vẻ = Vます bỏ ます / Aい bỏ い + そう. かもしれない = có lẽ; はず = chắc theo logic."
      },
      {
            "id": "g5_03",
            "groupId": 5,
            "question": "山田さんは今日来ない（　）しれません。",
            "translation": "Có lẽ hôm nay Yamada không đến.",
            "options": [
                  "かも",
                  "はず",
                  "そう",
                  "よう"
            ],
            "answer": 0,
            "explanation": "そうです có 2 loại: nghe nói = thể thường + そう; trông có vẻ = Vます bỏ ます / Aい bỏ い + そう. かもしれない = có lẽ; はず = chắc theo logic."
      },
      {
            "id": "g5_04",
            "groupId": 5,
            "question": "田中さんは毎日練習していますから、上手な（　）です。",
            "translation": "Tanaka luyện mỗi ngày nên chắc giỏi.",
            "options": [
                  "かもしれません",
                  "そう",
                  "はず",
                  "たい"
            ],
            "answer": 2,
            "explanation": "そうです có 2 loại: nghe nói = thể thường + そう; trông có vẻ = Vます bỏ ます / Aい bỏ い + そう. かもしれない = có lẽ; はず = chắc theo logic."
      },
      {
            "id": "g5_05",
            "groupId": 5,
            "question": "空が暗いです。雨が降り（　）です。",
            "translation": "Trời tối mây, có vẻ sắp mưa.",
            "options": [
                  "そう",
                  "よう",
                  "はず",
                  "かも"
            ],
            "answer": 0,
            "explanation": "そうです có 2 loại: nghe nói = thể thường + そう; trông có vẻ = Vます bỏ ます / Aい bỏ い + そう. かもしれない = có lẽ; はず = chắc theo logic."
      },
      {
            "id": "g5_06",
            "groupId": 5,
            "question": "この問題は難し（　）そうです。",
            "translation": "Câu này trông có vẻ khó.",
            "options": [
                  "い",
                  "く",
                  "な",
                  ""
            ],
            "answer": 3,
            "explanation": "そうです có 2 loại: nghe nói = thể thường + そう; trông có vẻ = Vます bỏ ます / Aい bỏ い + そう. かもしれない = có lẽ; はず = chắc theo logic."
      },
      {
            "id": "g5_07",
            "groupId": 5,
            "question": "あの人は先生（　）かもしれません。",
            "translation": "Người kia có lẽ là giáo viên.",
            "options": [
                  "",
                  "な",
                  "の",
                  "で"
            ],
            "answer": 0,
            "explanation": "Danh từ + かもしれません thường không cần だ trong N4: 先生かもしれません."
      },
      {
            "id": "g5_08",
            "groupId": 5,
            "question": "約束は三時です。もう三時半ですから、彼は忘れた（　）です。",
            "translation": "Hẹn 3 giờ, giờ 3 rưỡi rồi nên chắc anh ấy quên.",
            "options": [
                  "そう",
                  "はず",
                  "ない",
                  "ます"
            ],
            "answer": 1,
            "explanation": "そうです có 2 loại: nghe nói = thể thường + そう; trông có vẻ = Vます bỏ ます / Aい bỏ い + そう. かもしれない = có lẽ; はず = chắc theo logic."
      },
      {
            "id": "g5_09",
            "groupId": 5,
            "question": "友だちの話では、あの店は安い（　）です。",
            "translation": "Theo lời bạn tôi, nghe nói quán đó rẻ.",
            "options": [
                  "そう",
                  "たい",
                  "かも",
                  "はず"
            ],
            "answer": 0,
            "explanation": "そうです có 2 loại: nghe nói = thể thường + そう; trông có vẻ = Vます bỏ ます / Aい bỏ い + そう. かもしれない = có lẽ; はず = chắc theo logic."
      },
      {
            "id": "g5_10",
            "groupId": 5,
            "question": "このスープは熱（　）そうです。",
            "translation": "Món súp này trông có vẻ nóng.",
            "options": [
                  "い",
                  "く",
                  "な",
                  ""
            ],
            "answer": 3,
            "explanation": "そうです có 2 loại: nghe nói = thể thường + そう; trông có vẻ = Vます bỏ ます / Aい bỏ い + そう. かもしれない = có lẽ; はず = chắc theo logic."
      },
      {
            "id": "g6_01",
            "groupId": 6,
            "question": "旅行の前にホテルを予約して（　）ます。",
            "translation": "Trước chuyến đi, tôi đặt khách sạn sẵn.",
            "options": [
                  "あります",
                  "おきます",
                  "います",
                  "みます"
            ],
            "answer": 1,
            "explanation": "ておく = làm sẵn để chuẩn bị; てある = đồ vật đang ở trạng thái đã được ai đó làm sẵn có chủ ý."
      },
      {
            "id": "g6_02",
            "groupId": 6,
            "question": "机の上に本が置いて（　）ます。",
            "translation": "Trên bàn có đặt sẵn sách.",
            "options": [
                  "います",
                  "おきます",
                  "あります",
                  "しまいます"
            ],
            "answer": 2,
            "explanation": "ておく = làm sẵn để chuẩn bị; てある = đồ vật đang ở trạng thái đã được ai đó làm sẵn có chủ ý."
      },
      {
            "id": "g6_03",
            "groupId": 6,
            "question": "明日のために、資料をコピーして（　）ください。",
            "translation": "Hãy photo tài liệu sẵn cho ngày mai.",
            "options": [
                  "おいて",
                  "あって",
                  "いて",
                  "みて"
            ],
            "answer": 0,
            "explanation": "ておく = làm sẵn để chuẩn bị; てある = đồ vật đang ở trạng thái đã được ai đó làm sẵn có chủ ý."
      },
      {
            "id": "g6_04",
            "groupId": 6,
            "question": "窓が開けて（　）ます。",
            "translation": "Cửa sổ đã được mở sẵn.",
            "options": [
                  "います",
                  "あります",
                  "おきます",
                  "みます"
            ],
            "answer": 1,
            "explanation": "ておく = làm sẵn để chuẩn bị; てある = đồ vật đang ở trạng thái đã được ai đó làm sẵn có chủ ý."
      },
      {
            "id": "g6_05",
            "groupId": 6,
            "question": "パーティーの前に部屋を掃除して（　）ました。",
            "translation": "Trước bữa tiệc tôi đã dọn phòng sẵn.",
            "options": [
                  "おき",
                  "あり",
                  "い",
                  "み"
            ],
            "answer": 0,
            "explanation": "ておく = làm sẵn để chuẩn bị; てある = đồ vật đang ở trạng thái đã được ai đó làm sẵn có chủ ý."
      },
      {
            "id": "g6_06",
            "groupId": 6,
            "question": "壁に地図がはって（　）ます。",
            "translation": "Trên tường có dán sẵn bản đồ.",
            "options": [
                  "います",
                  "おきます",
                  "あります",
                  "みます"
            ],
            "answer": 2,
            "explanation": "ておく = làm sẵn để chuẩn bị; てある = đồ vật đang ở trạng thái đã được ai đó làm sẵn có chủ ý."
      },
      {
            "id": "g6_07",
            "groupId": 6,
            "question": "試験の前に、文法を復習して（　）ほうがいいです。",
            "translation": "Trước kỳ thi nên ôn ngữ pháp sẵn.",
            "options": [
                  "ある",
                  "いる",
                  "おいた",
                  "みた"
            ],
            "answer": 2,
            "explanation": "ておく = làm sẵn để chuẩn bị; てある = đồ vật đang ở trạng thái đã được ai đó làm sẵn có chủ ý."
      },
      {
            "id": "g6_08",
            "groupId": 6,
            "question": "電気がつけて（　）ました。",
            "translation": "Đèn đã được bật sẵn.",
            "options": [
                  "あり",
                  "おき",
                  "い",
                  "み"
            ],
            "answer": 0,
            "explanation": "ておく = làm sẵn để chuẩn bị; てある = đồ vật đang ở trạng thái đã được ai đó làm sẵn có chủ ý."
      },
      {
            "id": "g6_09",
            "groupId": 6,
            "question": "友だちが来るので、お茶を買って（　）ます。",
            "translation": "Vì bạn sắp đến nên mua trà sẵn.",
            "options": [
                  "あります",
                  "おきます",
                  "います",
                  "しまいます"
            ],
            "answer": 1,
            "explanation": "ておく = làm sẵn để chuẩn bị; てある = đồ vật đang ở trạng thái đã được ai đó làm sẵn có chủ ý."
      },
      {
            "id": "g6_10",
            "groupId": 6,
            "question": "黒板に名前が書いて（　）。",
            "translation": "Tên đã được viết sẵn trên bảng.",
            "options": [
                  "います",
                  "あります",
                  "おきます",
                  "みます"
            ],
            "answer": 1,
            "explanation": "ておく = làm sẵn để chuẩn bị; てある = đồ vật đang ở trạng thái đã được ai đó làm sẵn có chủ ý."
      },
      {
            "id": "g7_01",
            "groupId": 7,
            "question": "先生は学生に本を読ま（　）ました。",
            "translation": "Thầy/cô bắt học sinh đọc sách.",
            "options": [
                  "て",
                  "せ",
                  "させ",
                  "na"
            ],
            "answer": 1,
            "explanation": "Bị động: Vれる/られる. Sai khiến: Vせる/させる. Bị bắt làm: Vさせられる. Đây là mức N4 nên ưu tiên nhận dạng mẫu cơ bản."
      },
      {
            "id": "g7_02",
            "groupId": 7,
            "question": "私は父に部屋を掃除させ（　）ました。",
            "translation": "Tôi bị bố bắt dọn phòng.",
            "options": [
                  "られ",
                  "れ",
                  "させ",
                  "て"
            ],
            "answer": 0,
            "explanation": "Bị động: Vれる/られる. Sai khiến: Vせる/させる. Bị bắt làm: Vさせられる. Đây là mức N4 nên ưu tiên nhận dạng mẫu cơ bản."
      },
      {
            "id": "g7_03",
            "groupId": 7,
            "question": "弟は母に野菜を食べさせ（　）ました。",
            "translation": "Em trai bị mẹ bắt ăn rau.",
            "options": [
                  "ました",
                  "られ",
                  "れ",
                  "て"
            ],
            "answer": 1,
            "explanation": "Bị động: Vれる/られる. Sai khiến: Vせる/させる. Bị bắt làm: Vさせられる. Đây là mức N4 nên ưu tiên nhận dạng mẫu cơ bản."
      },
      {
            "id": "g7_04",
            "groupId": 7,
            "question": "私は友だちに写真を撮ら（　）ました。",
            "translation": "Tôi bị bạn chụp ảnh.",
            "options": [
                  "て",
                  "れ",
                  "ね",
                  "な"
            ],
            "answer": 1,
            "explanation": "Bị động: Vれる/られる. Sai khiến: Vせる/させる. Bị bắt làm: Vさせられる. Đây là mức N4 nên ưu tiên nhận dạng mẫu cơ bản."
      },
      {
            "id": "g7_05",
            "groupId": 7,
            "question": "母は子どもを早く寝（　）ました。",
            "translation": "Mẹ bắt/cho con ngủ sớm.",
            "options": [
                  "させ",
                  "られ",
                  "れ",
                  "せ"
            ],
            "answer": 0,
            "explanation": "Bị động: Vれる/られる. Sai khiến: Vせる/させる. Bị bắt làm: Vさせられる. Đây là mức N4 nên ưu tiên nhận dạng mẫu cơ bản."
      },
      {
            "id": "g7_06",
            "groupId": 7,
            "question": "私は先生に名前を呼ば（　）ました。",
            "translation": "Tôi được/bị thầy cô gọi tên.",
            "options": [
                  "て",
                  "れ",
                  "ね",
                  "な"
            ],
            "answer": 1,
            "explanation": "Bị động: Vれる/られる. Sai khiến: Vせる/させる. Bị bắt làm: Vさせられる. Đây là mức N4 nên ưu tiên nhận dạng mẫu cơ bản."
      },
      {
            "id": "g7_07",
            "groupId": 7,
            "question": "店で財布を盗ま（　）ました。",
            "translation": "Tôi bị trộm ví ở cửa hàng.",
            "options": [
                  "て",
                  "れ",
                  "ね",
                  "な"
            ],
            "answer": 1,
            "explanation": "Bị động: Vれる/られる. Sai khiến: Vせる/させる. Bị bắt làm: Vさせられる. Đây là mức N4 nên ưu tiên nhận dạng mẫu cơ bản."
      },
      {
            "id": "g7_08",
            "groupId": 7,
            "question": "先生は学生を立た（　）ました。",
            "translation": "Thầy/cô bắt học sinh đứng lên.",
            "options": [
                  "せ",
                  "れ",
                  "させ",
                  "られ"
            ],
            "answer": 0,
            "explanation": "Bị động: Vれる/られる. Sai khiến: Vせる/させる. Bị bắt làm: Vさせられる. Đây là mức N4 nên ưu tiên nhận dạng mẫu cơ bản."
      },
      {
            "id": "g7_09",
            "groupId": 7,
            "question": "私は会社で長い時間働かせ（　）ました。",
            "translation": "Tôi bị bắt làm việc lâu ở công ty.",
            "options": [
                  "れ",
                  "られ",
                  "せ",
                  "て"
            ],
            "answer": 1,
            "explanation": "Bị động: Vれる/られる. Sai khiến: Vせる/させる. Bị bắt làm: Vさせられる. Đây là mức N4 nên ưu tiên nhận dạng mẫu cơ bản."
      },
      {
            "id": "g7_10",
            "groupId": 7,
            "question": "子どもは先生にほめ（　）ました。",
            "translation": "Đứa trẻ được thầy/cô khen.",
            "options": [
                  "させ",
                  "られ",
                  "れ",
                  "せ"
            ],
            "answer": 1,
            "explanation": "Bị động: Vれる/られる. Sai khiến: Vせる/させる. Bị bắt làm: Vさせられる. Đây là mức N4 nên ưu tiên nhận dạng mẫu cơ bản."
      },
      {
            "id": "g8_01",
            "groupId": 8,
            "question": "宿題を早くし（　）なさい。",
            "translation": "Hãy làm bài tập nhanh đi.",
            "options": [
                  "て",
                  "ます",
                  "な",
                  ""
            ],
            "answer": 3,
            "explanation": "なさい = mệnh lệnh nhẹ Vます bỏ ます + なさい; よう/おう = ý chí/rủ rê thân mật; ことにする = tự quyết định."
      },
      {
            "id": "g8_02",
            "groupId": 8,
            "question": "明日から毎日走ること（　）しました。",
            "translation": "Tôi quyết định từ mai chạy mỗi ngày.",
            "options": [
                  "に",
                  "を",
                  "が",
                  "で"
            ],
            "answer": 0,
            "explanation": "なさい = mệnh lệnh nhẹ Vます bỏ ます + なさい; よう/おう = ý chí/rủ rê thân mật; ことにする = tự quyết định."
      },
      {
            "id": "g8_03",
            "groupId": 8,
            "question": "一緒に昼ご飯を食べ（　）。",
            "translation": "Cùng ăn trưa nào.",
            "options": [
                  "よう",
                  "なさい",
                  "ことにする",
                  "たい"
            ],
            "answer": 0,
            "explanation": "なさい = mệnh lệnh nhẹ Vます bỏ ます + なさい; よう/おう = ý chí/rủ rê thân mật; ことにする = tự quyết định."
      },
      {
            "id": "g8_04",
            "groupId": 8,
            "question": "もう遅いから、帰（　）。",
            "translation": "Muộn rồi, về thôi.",
            "options": [
                  "ろう",
                  "なさい",
                  "たい",
                  "ほしい"
            ],
            "answer": 0,
            "explanation": "なさい = mệnh lệnh nhẹ Vます bỏ ます + なさい; よう/おう = ý chí/rủ rê thân mật; ことにする = tự quyết định."
      },
      {
            "id": "g8_05",
            "groupId": 8,
            "question": "静かにし（　）なさい。",
            "translation": "Hãy im lặng nào.",
            "options": [
                  "て",
                  "ます",
                  "",
                  "よう"
            ],
            "answer": 2,
            "explanation": "なさい = mệnh lệnh nhẹ Vます bỏ ます + なさい; よう/おう = ý chí/rủ rê thân mật; ことにする = tự quyết định."
      },
      {
            "id": "g8_06",
            "groupId": 8,
            "question": "来年、日本へ留学することに（　）。",
            "translation": "Năm sau tôi quyết định đi du học Nhật.",
            "options": [
                  "みました",
                  "しました",
                  "あります",
                  "いきます"
            ],
            "answer": 1,
            "explanation": "なさい = mệnh lệnh nhẹ Vます bỏ ます + なさい; よう/おう = ý chí/rủ rê thân mật; ことにする = tự quyết định."
      },
      {
            "id": "g8_07",
            "groupId": 8,
            "question": "今日は早く寝（　）と思います。",
            "translation": "Hôm nay tôi định sẽ ngủ sớm.",
            "options": [
                  "よう",
                  "なさい",
                  "て",
                  "たい"
            ],
            "answer": 0,
            "explanation": "なさい = mệnh lệnh nhẹ Vます bỏ ます + なさい; よう/おう = ý chí/rủ rê thân mật; ことにする = tự quyết định."
      },
      {
            "id": "g8_08",
            "groupId": 8,
            "question": "先生の話をよく聞き（　）なさい。",
            "translation": "Hãy nghe kỹ lời thầy/cô.",
            "options": [
                  "",
                  "て",
                  "ます",
                  "よう"
            ],
            "answer": 0,
            "explanation": "なさい = mệnh lệnh nhẹ Vます bỏ ます + なさい; よう/おう = ý chí/rủ rê thân mật; ことにする = tự quyết định."
      },
      {
            "id": "g8_09",
            "groupId": 8,
            "question": "この夏はアルバイトをしないこと（　）しました。",
            "translation": "Mùa hè này tôi quyết định không đi làm thêm.",
            "options": [
                  "を",
                  "に",
                  "が",
                  "で"
            ],
            "answer": 1,
            "explanation": "なさい = mệnh lệnh nhẹ Vます bỏ ます + なさい; よう/おう = ý chí/rủ rê thân mật; ことにする = tự quyết định."
      },
      {
            "id": "g8_10",
            "groupId": 8,
            "question": "明日、図書館で勉強し（　）。",
            "translation": "Ngày mai học ở thư viện nhé.",
            "options": [
                  "よう",
                  "なさい",
                  "こと",
                  "ほしい"
            ],
            "answer": 0,
            "explanation": "なさい = mệnh lệnh nhẹ Vます bỏ ます + なさい; よう/おう = ý chí/rủ rê thân mật; ことにする = tự quyết định."
      },
      {
            "id": "g9_01",
            "groupId": 9,
            "question": "このペンは書き（　）です。",
            "translation": "Cây bút này dễ viết.",
            "options": [
                  "やすい",
                  "にくい",
                  "たい",
                  "そう"
            ],
            "answer": 0,
            "explanation": "Dễ/khó làm: Vます bỏ ます + やすい / にくい. Cụm này chia như tính từ い."
      },
      {
            "id": "g9_02",
            "groupId": 9,
            "question": "この漢字は覚え（　）です。",
            "translation": "Chữ Kanji này khó nhớ.",
            "options": [
                  "やすい",
                  "にくい",
                  "たい",
                  "ほしい"
            ],
            "answer": 1,
            "explanation": "Dễ/khó làm: Vます bỏ ます + やすい / にくい. Cụm này chia như tính từ い."
      },
      {
            "id": "g9_03",
            "groupId": 9,
            "question": "この道は歩き（　）です。",
            "translation": "Con đường này dễ đi bộ.",
            "options": [
                  "にくい",
                  "やすい",
                  "たい",
                  "そう"
            ],
            "answer": 1,
            "explanation": "Dễ/khó làm: Vます bỏ ます + やすい / にくい. Cụm này chia như tính từ い."
      },
      {
            "id": "g9_04",
            "groupId": 9,
            "question": "この説明は分かり（　）です。",
            "translation": "Lời giải thích này dễ hiểu.",
            "options": [
                  "にくい",
                  "やすい",
                  "たい",
                  "らしい"
            ],
            "answer": 1,
            "explanation": "Dễ/khó làm: Vます bỏ ます + やすい / にくい. Cụm này chia như tính từ い."
      },
      {
            "id": "g9_05",
            "groupId": 9,
            "question": "この靴は走り（　）です。",
            "translation": "Đôi giày này khó chạy.",
            "options": [
                  "やすい",
                  "たい",
                  "にくい",
                  "ほしい"
            ],
            "answer": 2,
            "explanation": "Dễ/khó làm: Vます bỏ ます + やすい / にくい. Cụm này chia như tính từ い."
      },
      {
            "id": "g9_06",
            "groupId": 9,
            "question": "小さい字は読み（　）です。",
            "translation": "Chữ nhỏ thì khó đọc.",
            "options": [
                  "やすい",
                  "にくい",
                  "たい",
                  "そう"
            ],
            "answer": 1,
            "explanation": "Dễ/khó làm: Vます bỏ ます + やすい / にくい. Cụm này chia như tính từ い."
      },
      {
            "id": "g9_07",
            "groupId": 9,
            "question": "このカメラは使い（　）です。",
            "translation": "Máy ảnh này dễ dùng.",
            "options": [
                  "やすい",
                  "にくい",
                  "ほしい",
                  "たがる"
            ],
            "answer": 0,
            "explanation": "Dễ/khó làm: Vます bỏ ます + やすい / にくい. Cụm này chia như tính từ い."
      },
      {
            "id": "g9_08",
            "groupId": 9,
            "question": "この薬は飲み（　）くないです。",
            "translation": "Thuốc này không dễ uống.",
            "options": [
                  "やす",
                  "にく",
                  "たい",
                  "ほし"
            ],
            "answer": 0,
            "explanation": "やすい chia phủ định như tính từ い: やすくない."
      },
      {
            "id": "g9_09",
            "groupId": 9,
            "question": "この問題は答え（　）です。",
            "translation": "Câu hỏi này khó trả lời.",
            "options": [
                  "やすい",
                  "にくい",
                  "たい",
                  "そう"
            ],
            "answer": 1,
            "explanation": "Dễ/khó làm: Vます bỏ ます + やすい / にくい. Cụm này chia như tính từ い."
      },
      {
            "id": "g9_10",
            "groupId": 9,
            "question": "この町は住み（　）と思います。",
            "translation": "Tôi nghĩ thành phố này dễ sống.",
            "options": [
                  "やすい",
                  "にくい",
                  "たい",
                  "ほしい"
            ],
            "answer": 0,
            "explanation": "Dễ/khó làm: Vます bỏ ます + やすい / にくい. Cụm này chia như tính từ い."
      },
      {
            "id": "g10_01",
            "groupId": 10,
            "question": "明日は学校へ行か（　）もいいです。",
            "translation": "Ngày mai không đi học cũng được.",
            "options": [
                  "ないで",
                  "なくて",
                  "なければ",
                  "ない"
            ],
            "answer": 1,
            "explanation": "なくてもいい = không cần cũng được; ないで = đừng/không làm; だけ đi với khẳng định, しか luôn đi với phủ định."
      },
      {
            "id": "g10_02",
            "groupId": 10,
            "question": "ここで写真を撮ら（　）ください。",
            "translation": "Xin đừng chụp ảnh ở đây.",
            "options": [
                  "ないで",
                  "なくて",
                  "なければ",
                  "ません"
            ],
            "answer": 0,
            "explanation": "なくてもいい = không cần cũng được; ないで = đừng/không làm; だけ đi với khẳng định, しか luôn đi với phủ định."
      },
      {
            "id": "g10_03",
            "groupId": 10,
            "question": "私は千円（　）ありません。",
            "translation": "Tôi chỉ có 1000 yên.",
            "options": [
                  "だけ",
                  "しか",
                  "まで",
                  "から"
            ],
            "answer": 1,
            "explanation": "なくてもいい = không cần cũng được; ないで = đừng/không làm; だけ đi với khẳng định, しか luôn đi với phủ định."
      },
      {
            "id": "g10_04",
            "groupId": 10,
            "question": "この店は日曜日（　）開いています。",
            "translation": "Cửa hàng này chỉ mở Chủ nhật.",
            "options": [
                  "しか",
                  "だけ",
                  "まで",
                  "でも"
            ],
            "answer": 1,
            "explanation": "なくてもいい = không cần cũng được; ないで = đừng/không làm; だけ đi với khẳng định, しか luôn đi với phủ định."
      },
      {
            "id": "g10_05",
            "groupId": 10,
            "question": "名前を書か（　）出してください。",
            "translation": "Đừng nộp mà không viết tên.",
            "options": [
                  "ないで",
                  "なくて",
                  "なければ",
                  "ない"
            ],
            "answer": 0,
            "explanation": "なくてもいい = không cần cũng được; ないで = đừng/không làm; だけ đi với khẳng định, しか luôn đi với phủ định."
      },
      {
            "id": "g10_06",
            "groupId": 10,
            "question": "宿題は今日出さなく（　）いいです。",
            "translation": "Bài tập không nộp hôm nay cũng được.",
            "options": [
                  "ても",
                  "ては",
                  "ないで",
                  "なければ"
            ],
            "answer": 0,
            "explanation": "なくてもいい = không cần cũng được; ないで = đừng/không làm; だけ đi với khẳng định, しか luôn đi với phủ định."
      },
      {
            "id": "g10_07",
            "groupId": 10,
            "question": "コーヒーは一杯（　）飲みませんでした。",
            "translation": "Tôi chỉ uống một cốc cà phê.",
            "options": [
                  "だけ",
                  "しか",
                  "まで",
                  "から"
            ],
            "answer": 1,
            "explanation": "なくてもいい = không cần cũng được; ないで = đừng/không làm; だけ đi với khẳng định, しか luôn đi với phủ định."
      },
      {
            "id": "g10_08",
            "groupId": 10,
            "question": "漢字を十個（　）覚えました。",
            "translation": "Tôi chỉ nhớ 10 chữ Kanji.",
            "options": [
                  "しか",
                  "だけ",
                  "ほど",
                  "まで"
            ],
            "answer": 1,
            "explanation": "なくてもいい = không cần cũng được; ないで = đừng/không làm; だけ đi với khẳng định, しか luôn đi với phủ định."
      },
      {
            "id": "g10_09",
            "groupId": 10,
            "question": "心配し（　）ください。",
            "translation": "Xin đừng lo lắng.",
            "options": [
                  "ないで",
                  "なくて",
                  "なければ",
                  "ない"
            ],
            "answer": 0,
            "explanation": "なくてもいい = không cần cũng được; ないで = đừng/không làm; だけ đi với khẳng định, しか luôn đi với phủ định."
      },
      {
            "id": "g10_10",
            "groupId": 10,
            "question": "今日は勉強しなく（　）いいです。",
            "translation": "Hôm nay không học cũng được.",
            "options": [
                  "ては",
                  "ても",
                  "ないで",
                  "なければ"
            ],
            "answer": 1,
            "explanation": "なくてもいい = không cần cũng được; ないで = đừng/không làm; だけ đi với khẳng định, しか luôn đi với phủ định."
      },
      {
            "id": "g11_01",
            "groupId": 11,
            "question": "あの人は先生（　）みたいです。",
            "translation": "Người kia trông giống giáo viên.",
            "options": [
                  "の",
                  "な",
                  "",
                  "に"
            ],
            "answer": 2,
            "explanation": "みたい = giống như, văn nói. ような + N; ように + V/A. Danh từ trước よう thường dùng のよう."
      },
      {
            "id": "g11_02",
            "groupId": 11,
            "question": "彼は子ども（　）よく笑います。",
            "translation": "Anh ấy cười nhiều như trẻ con.",
            "options": [
                  "のように",
                  "のような",
                  "みたいな",
                  "ような"
            ],
            "answer": 0,
            "explanation": "みたい = giống như, văn nói. ような + N; ように + V/A. Danh từ trước よう thường dùng のよう."
      },
      {
            "id": "g11_03",
            "groupId": 11,
            "question": "これは日本の家（　）建物です。",
            "translation": "Đây là tòa nhà giống nhà Nhật.",
            "options": [
                  "のように",
                  "のような",
                  "みたい",
                  "ように"
            ],
            "answer": 1,
            "explanation": "みたい = giống như, văn nói. ような + N; ように + V/A. Danh từ trước よう thường dùng のよう."
      },
      {
            "id": "g11_04",
            "groupId": 11,
            "question": "今日は夏（　）暑いです。",
            "translation": "Hôm nay nóng như mùa hè.",
            "options": [
                  "みたいに",
                  "みたいな",
                  "ような",
                  "のような"
            ],
            "answer": 0,
            "explanation": "みたい = giống như, văn nói. ような + N; ように + V/A. Danh từ trước よう thường dùng のよう."
      },
      {
            "id": "g11_05",
            "groupId": 11,
            "question": "山田さんは歌手（　）声です。",
            "translation": "Yamada có giọng như ca sĩ.",
            "options": [
                  "のような",
                  "のように",
                  "みたいに",
                  "ように"
            ],
            "answer": 0,
            "explanation": "みたい = giống như, văn nói. ような + N; ように + V/A. Danh từ trước よう thường dùng のよう."
      },
      {
            "id": "g11_06",
            "groupId": 11,
            "question": "この犬は人間（　）歩きます。",
            "translation": "Con chó này đi như người.",
            "options": [
                  "のように",
                  "のような",
                  "みたいな",
                  "ような"
            ],
            "answer": 0,
            "explanation": "みたい = giống như, văn nói. ような + N; ように + V/A. Danh từ trước よう thường dùng のよう."
      },
      {
            "id": "g11_07",
            "groupId": 11,
            "question": "彼女は花（　）きれいです。",
            "translation": "Cô ấy đẹp như hoa.",
            "options": [
                  "のように",
                  "のような",
                  "みたいな",
                  "ような"
            ],
            "answer": 0,
            "explanation": "みたい = giống như, văn nói. ような + N; ように + V/A. Danh từ trước よう thường dùng のよう."
      },
      {
            "id": "g11_08",
            "groupId": 11,
            "question": "これは夢（　）話ですね。",
            "translation": "Đây là câu chuyện như mơ nhỉ.",
            "options": [
                  "のような",
                  "のように",
                  "みたいに",
                  "ように"
            ],
            "answer": 0,
            "explanation": "みたい = giống như, văn nói. ような + N; ように + V/A. Danh từ trước よう thường dùng のよう."
      },
      {
            "id": "g11_09",
            "groupId": 11,
            "question": "赤ちゃん（　）寝ています。",
            "translation": "Đang ngủ như em bé.",
            "options": [
                  "みたいに",
                  "みたいな",
                  "ような",
                  "のような"
            ],
            "answer": 0,
            "explanation": "みたい = giống như, văn nói. ような + N; ように + V/A. Danh từ trước よう thường dùng のよう."
      },
      {
            "id": "g11_10",
            "groupId": 11,
            "question": "あの雲は魚（　）見えます。",
            "translation": "Đám mây kia trông giống cá.",
            "options": [
                  "みたいに",
                  "みたいな",
                  "ような",
                  "のような"
            ],
            "answer": 0,
            "explanation": "みたい = giống như, văn nói. ような + N; ように + V/A. Danh từ trước よう thường dùng のよう."
      },
      {
            "id": "g12_01",
            "groupId": 12,
            "question": "遅れて（　）。",
            "translation": "Xin lỗi vì đến muộn.",
            "options": [
                  "よかったです",
                  "すみません",
                  "ほしいです",
                  "みます"
            ],
            "answer": 1,
            "explanation": "てすみません = xin lỗi vì đã; てよかった = may vì đã; ばよかった = lẽ ra nên/giá mà, diễn tả hối tiếc."
      },
      {
            "id": "g12_02",
            "groupId": 12,
            "question": "日本語を勉強して（　）。",
            "translation": "May là tôi đã học tiếng Nhật.",
            "options": [
                  "すみません",
                  "よかったです",
                  "ばよかった",
                  "ください"
            ],
            "answer": 1,
            "explanation": "てすみません = xin lỗi vì đã; てよかった = may vì đã; ばよかった = lẽ ra nên/giá mà, diễn tả hối tiếc."
      },
      {
            "id": "g12_03",
            "groupId": 12,
            "question": "もっと早く寝れ（　）。",
            "translation": "Giá mà tôi ngủ sớm hơn.",
            "options": [
                  "よかったです",
                  "ばよかったです",
                  "てすみません",
                  "たいです"
            ],
            "answer": 1,
            "explanation": "てすみません = xin lỗi vì đã; てよかった = may vì đã; ばよかった = lẽ ra nên/giá mà, diễn tả hối tiếc."
      },
      {
            "id": "g12_04",
            "groupId": 12,
            "question": "電話しなくて（　）。",
            "translation": "Xin lỗi vì đã không gọi điện.",
            "options": [
                  "すみません",
                  "よかった",
                  "ばよかった",
                  "ほしい"
            ],
            "answer": 0,
            "explanation": "てすみません = xin lỗi vì đã; てよかった = may vì đã; ばよかった = lẽ ra nên/giá mà, diễn tả hối tiếc."
      },
      {
            "id": "g12_05",
            "groupId": 12,
            "question": "試験に合格できて（　）。",
            "translation": "May là tôi đã có thể đỗ kỳ thi.",
            "options": [
                  "すみません",
                  "よかったです",
                  "ばよかったです",
                  "たいです"
            ],
            "answer": 1,
            "explanation": "てすみません = xin lỗi vì đã; てよかった = may vì đã; ばよかった = lẽ ra nên/giá mà, diễn tả hối tiếc."
      },
      {
            "id": "g12_06",
            "groupId": 12,
            "question": "傘を持ってくれ（　）。",
            "translation": "Giá mà tôi đã mang ô.",
            "options": [
                  "てすみません",
                  "ばよかったです",
                  "てみます",
                  "たいです"
            ],
            "answer": 1,
            "explanation": "てすみません = xin lỗi vì đã; てよかった = may vì đã; ばよかった = lẽ ra nên/giá mà, diễn tả hối tiếc."
      },
      {
            "id": "g12_07",
            "groupId": 12,
            "question": "部屋を汚して（　）。",
            "translation": "Xin lỗi vì làm bẩn phòng.",
            "options": [
                  "よかった",
                  "すみません",
                  "ばよかった",
                  "ほしい"
            ],
            "answer": 1,
            "explanation": "てすみません = xin lỗi vì đã; てよかった = may vì đã; ばよかった = lẽ ra nên/giá mà, diễn tả hối tiếc."
      },
      {
            "id": "g12_08",
            "groupId": 12,
            "question": "友だちに会えて（　）。",
            "translation": "May là đã gặp được bạn.",
            "options": [
                  "よかったです",
                  "すみません",
                  "ばよかったです",
                  "ください"
            ],
            "answer": 0,
            "explanation": "てすみません = xin lỗi vì đã; てよかった = may vì đã; ばよかった = lẽ ra nên/giá mà, diễn tả hối tiếc."
      },
      {
            "id": "g12_09",
            "groupId": 12,
            "question": "もっと勉強すれ（　）。",
            "translation": "Lẽ ra nên học nhiều hơn.",
            "options": [
                  "ばよかったです",
                  "てよかったです",
                  "てすみません",
                  "たいです"
            ],
            "answer": 0,
            "explanation": "てすみません = xin lỗi vì đã; てよかった = may vì đã; ばよかった = lẽ ra nên/giá mà, diễn tả hối tiếc."
      },
      {
            "id": "g12_10",
            "groupId": 12,
            "question": "約束を忘れて（　）。",
            "translation": "Xin lỗi vì quên cuộc hẹn.",
            "options": [
                  "よかった",
                  "ばよかった",
                  "すみません",
                  "ほしい"
            ],
            "answer": 2,
            "explanation": "てすみません = xin lỗi vì đã; てよかった = may vì đã; ばよかった = lẽ ra nên/giá mà, diễn tả hối tiếc."
      },
      {
            "id": "g13_01",
            "groupId": 13,
            "question": "この服を着て（　）ます。",
            "translation": "Tôi thử mặc bộ đồ này.",
            "options": [
                  "み",
                  "ながら",
                  "いるあいだに",
                  "おき"
            ],
            "answer": 0,
            "explanation": "てみる = thử làm; ながら = vừa...vừa..., Vます bỏ ます + ながら; あいだに = trong lúc... thì có việc xảy ra."
      },
      {
            "id": "g13_02",
            "groupId": 13,
            "question": "音楽を聞き（　）勉強します。",
            "translation": "Vừa nghe nhạc vừa học.",
            "options": [
                  "てみて",
                  "ながら",
                  "あいだに",
                  "ても"
            ],
            "answer": 1,
            "explanation": "てみる = thử làm; ながら = vừa...vừa..., Vます bỏ ます + ながら; あいだに = trong lúc... thì có việc xảy ra."
      },
      {
            "id": "g13_03",
            "groupId": 13,
            "question": "寝ている（　）、雨が降りました。",
            "translation": "Trong lúc tôi ngủ thì trời mưa.",
            "options": [
                  "ながら",
                  "みる",
                  "あいだに",
                  "ても"
            ],
            "answer": 2,
            "explanation": "てみる = thử làm; ながら = vừa...vừa..., Vます bỏ ます + ながら; あいだに = trong lúc... thì có việc xảy ra."
      },
      {
            "id": "g13_04",
            "groupId": 13,
            "question": "新しい料理を作って（　）たいです。",
            "translation": "Tôi muốn thử nấu món mới.",
            "options": [
                  "ながら",
                  "み",
                  "あいだに",
                  "ある"
            ],
            "answer": 1,
            "explanation": "てみる = thử làm; ながら = vừa...vừa..., Vます bỏ ます + ながら; あいだに = trong lúc... thì có việc xảy ra."
      },
      {
            "id": "g13_05",
            "groupId": 13,
            "question": "テレビを見（　）ご飯を食べます。",
            "translation": "Vừa xem TV vừa ăn cơm.",
            "options": [
                  "ながら",
                  "てみて",
                  "あいだに",
                  "ても"
            ],
            "answer": 0,
            "explanation": "てみる = thử làm; ながら = vừa...vừa..., Vます bỏ ます + ながら; あいだに = trong lúc... thì có việc xảy ra."
      },
      {
            "id": "g13_06",
            "groupId": 13,
            "question": "留守の（　）、友だちが来ました。",
            "translation": "Trong lúc tôi vắng nhà thì bạn đến.",
            "options": [
                  "ながら",
                  "あいだに",
                  "てみて",
                  "ても"
            ],
            "answer": 1,
            "explanation": "てみる = thử làm; ながら = vừa...vừa..., Vます bỏ ます + ながら; あいだに = trong lúc... thì có việc xảy ra."
      },
      {
            "id": "g13_07",
            "groupId": 13,
            "question": "分からない言葉を辞書で調べて（　）ください。",
            "translation": "Hãy thử tra từ không hiểu bằng từ điển.",
            "options": [
                  "ながら",
                  "みて",
                  "あいだに",
                  "おいて"
            ],
            "answer": 1,
            "explanation": "てみる = thử làm; ながら = vừa...vừa..., Vます bỏ ます + ながら; あいだに = trong lúc... thì có việc xảy ra."
      },
      {
            "id": "g13_08",
            "groupId": 13,
            "question": "歩き（　）電話しないでください。",
            "translation": "Đừng vừa đi vừa gọi điện.",
            "options": [
                  "ながら",
                  "てみて",
                  "あいだに",
                  "ても"
            ],
            "answer": 0,
            "explanation": "てみる = thử làm; ながら = vừa...vừa..., Vます bỏ ます + ながら; あいだに = trong lúc... thì có việc xảy ra."
      },
      {
            "id": "g13_09",
            "groupId": 13,
            "question": "母が買い物をしている（　）、私は料理をしました。",
            "translation": "Trong lúc mẹ đang mua sắm, tôi nấu ăn.",
            "options": [
                  "ながら",
                  "あいだに",
                  "てみて",
                  "ても"
            ],
            "answer": 1,
            "explanation": "てみる = thử làm; ながら = vừa...vừa..., Vます bỏ ます + ながら; あいだに = trong lúc... thì có việc xảy ra."
      },
      {
            "id": "g13_10",
            "groupId": 13,
            "question": "この問題をもう一度考えて（　）ましょう。",
            "translation": "Hãy thử suy nghĩ câu này thêm lần nữa.",
            "options": [
                  "ながら",
                  "み",
                  "あいだに",
                  "ないで"
            ],
            "answer": 1,
            "explanation": "てみる = thử làm; ながら = vừa...vừa..., Vます bỏ ます + ながら; あいだに = trong lúc... thì có việc xảy ra."
      },
      {
            "id": "g14_01",
            "groupId": 14,
            "question": "音を小さ（　）してください。",
            "translation": "Hãy làm nhỏ âm thanh lại.",
            "options": [
                  "く",
                  "に",
                  "な",
                  "で"
            ],
            "answer": 0,
            "explanation": "Tính từ い bỏ い + くする. Tính từ な/Danh từ + にする. Nghĩa là làm cho trở nên/trạng thái được chọn."
      },
      {
            "id": "g14_02",
            "groupId": 14,
            "question": "部屋をきれい（　）しました。",
            "translation": "Tôi làm phòng sạch sẽ.",
            "options": [
                  "く",
                  "に",
                  "な",
                  "で"
            ],
            "answer": 1,
            "explanation": "Tính từ い bỏ い + くする. Tính từ な/Danh từ + にする. Nghĩa là làm cho trở nên/trạng thái được chọn."
      },
      {
            "id": "g14_03",
            "groupId": 14,
            "question": "字を大き（　）書いてください。",
            "translation": "Hãy viết chữ to lên.",
            "options": [
                  "く",
                  "に",
                  "な",
                  "で"
            ],
            "answer": 0,
            "explanation": "Tính từ い bỏ い + くする. Tính từ な/Danh từ + にする. Nghĩa là làm cho trở nên/trạng thái được chọn."
      },
      {
            "id": "g14_04",
            "groupId": 14,
            "question": "教室を静か（　）してください。",
            "translation": "Hãy làm lớp học yên lặng.",
            "options": [
                  "く",
                  "に",
                  "な",
                  "で"
            ],
            "answer": 1,
            "explanation": "Tính từ い bỏ い + くする. Tính từ な/Danh từ + にする. Nghĩa là làm cho trở nên/trạng thái được chọn."
      },
      {
            "id": "g14_05",
            "groupId": 14,
            "question": "スープを熱（　）しました。",
            "translation": "Tôi làm nóng súp.",
            "options": [
                  "い",
                  "く",
                  "に",
                  "な"
            ],
            "answer": 1,
            "explanation": "Tính từ い bỏ い + くする. Tính từ な/Danh từ + にする. Nghĩa là làm cho trở nên/trạng thái được chọn."
      },
      {
            "id": "g14_06",
            "groupId": 14,
            "question": "お茶を甘（　）しました。",
            "translation": "Tôi làm ngọt trà (pha ngọt).",
            "options": [
                  "く",
                  "に",
                  "な",
                  "đ"
            ],
            "answer": 0,
            "explanation": "Tính từ い bỏ い + くする. Tính từ な/Danh từ + にする. Nghĩa là làm cho trở nên/trạng thái được chọn."
      },
      {
            "id": "g14_07",
            "groupId": 14,
            "question": "電気を明る（　）してください。",
            "translation": "Hãy làm đèn sáng hơn.",
            "options": [
                  "く",
                  "に",
                  "な",
                  "で"
            ],
            "answer": 0,
            "explanation": "Tính từ い bỏ い + くする. Tính từ な/Danh từ + にする. Nghĩa là làm cho trở nên/trạng thái được chọn."
      },
      {
            "id": "g14_08",
            "groupId": 14,
            "question": "髪を短（　）しました。",
            "translation": "Tôi đã làm tóc ngắn lại/cắt ngắn tóc.",
            "options": [
                  "く",
                  "に",
                  "な",
                  "で"
            ],
            "answer": 0,
            "explanation": "Tính từ い bỏ い + くする. Tính từ な/Danh từ + にする. Nghĩa là làm cho trở nên/trạng thái được chọn."
      },
      {
            "id": "g14_09",
            "groupId": 14,
            "question": "この紙を半分（　）してください。",
            "translation": "Hãy làm tờ giấy này thành một nửa/gấp đôi chia nửa.",
            "options": [
                  "く",
                  "に",
                  "な",
                  "で"
            ],
            "answer": 1,
            "explanation": "Tính từ い bỏ い + くする. Tính từ な/Danh từ + にする. Nghĩa là làm cho trở nên/trạng thái được chọn."
      },
      {
            "id": "g14_10",
            "groupId": 14,
            "question": "生活を便利（　）したいです。",
            "translation": "Tôi muốn làm cuộc sống tiện lợi hơn.",
            "options": [
                  "く",
                  "に",
                  "な",
                  "で"
            ],
            "answer": 1,
            "explanation": "Tính từ い bỏ い + くする. Tính từ な/Danh từ + にする. Nghĩa là làm cho trở nên/trạng thái được chọn."
      },
      {
            "id": "g15_01",
            "groupId": 15,
            "question": "明日雨が降る（　）分かりません。",
            "translation": "Tôi không biết mai có mưa hay không.",
            "options": [
                  "かどうか",
                  "という",
                  "ながら",
                  "ても"
            ],
            "answer": 0,
            "explanation": "かどうか = có... hay không; từ nghi vấn + か = câu hỏi gián tiếp; という = được gọi là/tên là."
      },
      {
            "id": "g15_02",
            "groupId": 15,
            "question": "駅がどこ（　）教えてください。",
            "translation": "Hãy chỉ cho tôi nhà ga ở đâu.",
            "options": [
                  "か",
                  "かどうか",
                  "という",
                  "ても"
            ],
            "answer": 0,
            "explanation": "かどうか = có... hay không; từ nghi vấn + か = câu hỏi gián tiếp; という = được gọi là/tên là."
      },
      {
            "id": "g15_03",
            "groupId": 15,
            "question": "「さくら」（　）歌を知っていますか。",
            "translation": "Bạn có biết bài hát tên là Sakura không?",
            "options": [
                  "かどうか",
                  "という",
                  "ながら",
                  "ても"
            ],
            "answer": 1,
            "explanation": "かどうか = có... hay không; từ nghi vấn + か = câu hỏi gián tiếp; という = được gọi là/tên là."
      },
      {
            "id": "g15_04",
            "groupId": 15,
            "question": "田中さんが来る（　）聞いてください。",
            "translation": "Hãy hỏi xem Tanaka có đến hay không.",
            "options": [
                  "という",
                  "かどうか",
                  "ながら",
                  "ても"
            ],
            "answer": 1,
            "explanation": "かどうか = có... hay không; từ nghi vấn + か = câu hỏi gián tiếp; という = được gọi là/tên là."
      },
      {
            "id": "g15_05",
            "groupId": 15,
            "question": "この漢字をどう読む（　）分かりますか。",
            "translation": "Bạn biết chữ Kanji này đọc thế nào không?",
            "options": [
                  "か",
                  "かどうか",
                  "という",
                  "なら"
            ],
            "answer": 0,
            "explanation": "かどうか = có... hay không; từ nghi vấn + か = câu hỏi gián tiếp; という = được gọi là/tên là."
      },
      {
            "id": "g15_06",
            "groupId": 15,
            "question": "日本へ行ったことがある（　）聞きました。",
            "translation": "Tôi đã hỏi xem có từng đi Nhật chưa.",
            "options": [
                  "かどうか",
                  "という",
                  "ながら",
                  "ても"
            ],
            "answer": 0,
            "explanation": "かどうか = có... hay không; từ nghi vấn + か = câu hỏi gián tiếp; という = được gọi là/tên là."
      },
      {
            "id": "g15_07",
            "groupId": 15,
            "question": "「ドラえもん」（　）アニメを知っていますか。",
            "translation": "Bạn có biết phim hoạt hình tên là Doraemon không?",
            "options": [
                  "か",
                  "かどうか",
                  "という",
                  "ても"
            ],
            "answer": 2,
            "explanation": "かどうか = có... hay không; từ nghi vấn + か = câu hỏi gián tiếp; という = được gọi là/tên là."
      },
      {
            "id": "g15_08",
            "groupId": 15,
            "question": "試験が何時に始まる（　）知っていますか。",
            "translation": "Bạn biết kỳ thi bắt đầu lúc mấy giờ không?",
            "options": [
                  "か",
                  "かどうか",
                  "という",
                  "ても"
            ],
            "answer": 0,
            "explanation": "かどうか = có... hay không; từ nghi vấn + か = câu hỏi gián tiếp; という = được gọi là/tên là."
      },
      {
            "id": "g15_09",
            "groupId": 15,
            "question": "彼が学生（　）分かりません。",
            "translation": "Tôi không biết anh ấy có phải sinh viên hay không.",
            "options": [
                  "かどうか",
                  "という",
                  "ながら",
                  "ても"
            ],
            "answer": 0,
            "explanation": "かどうか = có... hay không; từ nghi vấn + か = câu hỏi gián tiếp; という = được gọi là/tên là."
      },
      {
            "id": "g15_10",
            "groupId": 15,
            "question": "ベトナム（　）国から来ました。",
            "translation": "Tôi đến từ đất nước gọi là Việt Nam.",
            "options": [
                  "かどうか",
                  "という",
                  "ながら",
                  "ても"
            ],
            "answer": 1,
            "explanation": "かどうか = có... hay không; từ nghi vấn + か = câu hỏi gián tiếp; という = được gọi là/tên là."
      },
      {
            "id": "g1_11",
            "groupId": 1,
            "question": "私は佐藤さんにきれいな切手を（　）ました。",
            "translation": "Tôi được cô Sato cho/tặng bộ tem đẹp.",
            "options": [
                  "あげ",
                  "くれ",
                  "もらい",
                  "やり"
            ],
            "answer": 2,
            "explanation": "Chủ ngữ là 私は và đi với trợ từ に (佐藤さんに) chỉ hành động nhận từ ai đó: もらいました."
      },
      {
            "id": "g1_12",
            "groupId": 1,
            "question": "鈴木さんが私の仕事を手伝って（　）ました。",
            "translation": "Anh Suzuki đã giúp tôi một tay trong công việc.",
            "options": [
                  "くれ",
                  "もらい",
                  "あげ",
                  "いただき"
            ],
            "answer": 0,
            "explanation": "Chủ ngữ là người khác (鈴木さんが) làm việc tốt cho tôi: てくれました."
      },
      {
            "id": "g3_11",
            "groupId": 3,
            "question": "お金が足らなけれ（　）、貸してあげます。",
            "translation": "Nếu không đủ tiền, tôi sẽ cho bạn mượn.",
            "options": [
                  "ば",
                  "と",
                  "たら",
                  "なら"
            ],
            "answer": 0,
            "explanation": "Thể điều kiện của tính từ/dạng phủ định なければ. Chỉ có ば mới đi sau cấu trúc chia đuôi của '足らなけれ'."
      },
      {
            "id": "g3_12",
            "groupId": 3,
            "question": "宿題が終わっ（　）、遊びに行ってもいいですよ。",
            "translation": "Sau khi làm xong bài tập, bạn có thể đi chơi.",
            "options": [
                  "たら",
                  "と",
                  "ば",
                  "なら"
            ],
            "answer": 0,
            "explanation": "Kết hợp thể quá khứ (た-form) của động từ để chỉ trình tự thời gian sau khi làm xong việc gì đó: 終わったら."
      },
      {
            "id": "g5_11",
            "groupId": 5,
            "question": "荷物が重いですから、ひもが切れ（　）そうです。",
            "translation": "Vì hành lý nặng nên dây có vẻ sắp đứt.",
            "options": [
                  "そう",
                  "よう",
                  "はず",
                  "みたい"
            ],
            "answer": 0,
            "explanation": "Vます (bỏ ます) + そうです: trông có vẻ sắp xảy ra một sự việc. 切れ (thể ます của 切れる) + そうです."
      },
      {
            "id": "g5_12",
            "groupId": 5,
            "question": "田中さんは英語がペラペラですから、アメリカに住んでいた（　）です。",
            "translation": "Anh Tanaka nói tiếng Anh trôi chảy nên chắc chắn là đã từng sống ở Mỹ.",
            "options": [
                  "はず",
                  "そう",
                  "たい",
                  "たら"
            ],
            "answer": 0,
            "explanation": "Thể thông thường + はずです: chắc chắn là (suy đoán dựa trên cơ sở logic chắc chắn: vì nói tiếng Anh trôi chảy)."
      },
      {
            "id": "g7_11",
            "groupId": 7,
            "question": "夜中、赤ん坊に泣か（　）て、寝られませんでした。",
            "translation": "Nửa đêm bị em bé khóc làm phiền nên tôi không ngủ được.",
            "options": [
                  "れ",
                  "せ",
                  "させ",
                  "て"
            ],
            "answer": 0,
            "explanation": "Bị động gián tiếp (gây phiền toái): 泣く (nhóm 1) -> 泣かれる. 泣か + れ + て = 泣かれて."
      },
      {
            "id": "g7_12",
            "groupId": 7,
            "question": "この薬は苦いですが、子どもに飲ま（　）ました。",
            "translation": "Thuốc này đắng nhưng tôi đã bắt con uống.",
            "options": [
                  "せ",
                  "れ",
                  "させ",
                  "て"
            ],
            "answer": 0,
            "explanation": "Thể sai khiến (bắt buộc/cho phép): 飲む (nhóm 1) -> 飲ませる. 飲ま + せ + ました = 飲ませました."
      },
      {
            "id": "g10_11",
            "groupId": 10,
            "question": "冷蔵庫には牛乳（　）ありませんから、買い物に行きます。",
            "translation": "Trong tủ lạnh chỉ còn sữa thôi nên tôi đi mua đồ đây.",
            "options": [
                  "しか",
                  "だけ",
                  "が",
                  "を"
            ],
            "answer": 0,
            "explanation": "Hạn chế mang nghĩa tiêu cực: しか + phủ định (ありません). Chỉ có sữa thôi (và thế là thiếu thốn)."
      },
      {
            "id": "g10_12",
            "groupId": 10,
            "question": "あしたは休みですから、早く起き（　）もいいです。",
            "translation": "Mai là ngày nghỉ nên không cần dậy sớm cũng được.",
            "options": [
                  "なくても",
                  "ないで",
                  "なければ",
                  "ない"
            ],
            "answer": 0,
            "explanation": "Cho phép không cần làm gì: Vなくて + もいいです. 起き + なくても + いいです."
      }
];