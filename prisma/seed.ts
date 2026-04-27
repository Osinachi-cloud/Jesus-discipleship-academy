import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...\n");

  // Create Admin User
  const hashedPassword = await bcrypt.hash("Sinach=1234", 12);
  const securityAnswer1 = await bcrypt.hash("obatej", 12);
  const securityAnswer2 = await bcrypt.hash("silver", 12);
  const admin = await prisma.user.upsert({
    where: { email: "uchenna.ogbodo.001@gmail.com" },
    update: {
      securityAnswer1,
      securityAnswer2,
    },
    create: {
      email: "uchenna.ogbodo.001@gmail.com",
      password: hashedPassword,
      name: "Uchenna Ogbodo",
      role: "admin",
      securityAnswer1,
      securityAnswer2,
    },
  });
  console.log("Admin user created:", admin.email);

  // Create Categories
  const categoriesData = [
    { name: "Discipleship", slug: "discipleship" },
    { name: "Commentary", slug: "commentary" },
    { name: "Teachings", slug: "teachings" },
    { name: "Devotionals", slug: "devotionals" },
    { name: "Bible Study", slug: "bible-study" },
    { name: "Prayer", slug: "prayer" },
    { name: "Family & Marriage", slug: "family-marriage" },
    { name: "Youth Ministry", slug: "youth-ministry" },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories[cat.slug] = created.id;
  }
  console.log("Categories created:", Object.keys(categories).join(", "));

  // Create Posts with rich content
  const postsData = [
    {
      title: "The Cost of Discipleship: What It Truly Means to Follow Christ",
      slug: "cost-of-discipleship",
      categorySlug: "discipleship",
      featuredImage: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1200",
      excerpt: "Exploring the profound call of Jesus to take up our cross and follow Him, examining what true discipleship costs and what it offers in return.",
      content: `
<h2>Understanding the Call to Discipleship</h2>
<p>In Luke 14:27, Jesus declares, <em>"Whoever does not carry their cross and follow me cannot be my disciple."</em> These words challenge us to examine the depth of our commitment to Christ. Discipleship is not a casual undertaking—it demands everything we have and everything we are.</p>

<p>Dietrich Bonhoeffer, in his seminal work "The Cost of Discipleship," wrote: <em>"When Christ calls a man, he bids him come and die."</em> This death is not merely physical martyrdom for most of us, but a daily dying to self, to our ambitions, our comforts, and our own will.</p>

<h3>The Three Dimensions of Discipleship Cost</h3>

<h4>1. Surrender of Self-Will</h4>
<p>The first cost of discipleship is the surrender of our own will. Jesus modeled this in Gethsemane when He prayed, "Not my will, but yours be done" (Luke 22:42). This surrender is not a one-time event but a continuous posture of submission to God's sovereignty.</p>

<blockquote>True discipleship begins where self-will ends. We cannot serve two masters—our own desires and God's kingdom purposes must be brought into alignment, with God's will taking precedence.</blockquote>

<h4>2. Reordering of Relationships</h4>
<p>Jesus' words in Luke 14:26 are startling: "If anyone comes to me and does not hate father and mother, wife and children, brothers and sisters—yes, even their own life—such a person cannot be my disciple." This is not a call to literal hatred but to a love for Christ so supreme that all other loves pale in comparison.</p>

<p>Our relationships must be reordered with Christ at the center. This means:</p>
<ul>
  <li>Family relationships are enriched, not diminished, when Christ is Lord</li>
  <li>Friendships are deepened when built on eternal foundations</li>
  <li>Community is strengthened when unified in Christ's mission</li>
  <li>Even our relationship with ourselves must be surrendered to His lordship</li>
</ul>

<h4>3. Stewardship of Resources</h4>
<p>Luke 14:33 concludes Jesus' teaching on discipleship: "Those of you who do not give up everything you have cannot be my disciples." This is not necessarily a call to poverty but to a recognition that everything we possess belongs to God.</p>

<h3>The Rewards That Outweigh the Cost</h3>
<p>While the cost is real, the rewards are incomparable. Jesus promised in Mark 10:29-30 that those who have left everything for His sake will receive "a hundred times as much in this present age" along with eternal life.</p>

<p>The rewards of discipleship include:</p>
<ol>
  <li><strong>Intimate fellowship with Christ</strong> - Walking daily with the Creator of the universe</li>
  <li><strong>Transformation of character</strong> - Being conformed to the image of Christ</li>
  <li><strong>Eternal perspective</strong> - Living with purpose that transcends this temporal life</li>
  <li><strong>Spiritual family</strong> - Belonging to a global community of believers</li>
  <li><strong>Divine empowerment</strong> - Receiving the Holy Spirit's power for witness and service</li>
</ol>

<h3>Practical Steps for Counting the Cost</h3>
<p>How do we practically apply this teaching? Consider these disciplines:</p>

<p><strong>Daily Surrender:</strong> Begin each day by presenting yourself as a living sacrifice (Romans 12:1). Consciously submit your plans, thoughts, and actions to Christ's lordship.</p>

<p><strong>Regular Self-Examination:</strong> Periodically evaluate your life against Jesus' teachings. Where are you holding back? What areas remain unsurrendered?</p>

<p><strong>Community Accountability:</strong> Walk with other disciples who will encourage you, challenge you, and hold you accountable to your commitment.</p>

<p><strong>Generous Living:</strong> Practice radical generosity as a tangible expression of your recognition that all you have belongs to God.</p>

<h3>Conclusion</h3>
<p>The cost of discipleship is high, but it is never higher than the cost of not following Christ. As Jim Elliot wrote before his martyrdom, "He is no fool who gives what he cannot keep to gain that which he cannot lose."</p>

<p>May we be found faithful—not merely admirers of Jesus, but true disciples who have counted the cost and found Him worthy of our all.</p>
`,
    },
    {
      title: "Understanding the Beatitudes: A Verse-by-Verse Commentary",
      slug: "understanding-beatitudes-commentary",
      categorySlug: "commentary",
      featuredImage: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1200",
      excerpt: "A deep dive into Matthew 5:3-12, exploring the revolutionary teachings of Jesus in the Sermon on the Mount and their application for modern believers.",
      content: `
<h2>Introduction to the Beatitudes</h2>
<p>The Beatitudes, found in Matthew 5:3-12, open the Sermon on the Mount—the most comprehensive collection of Jesus' ethical teachings. These eight declarations turn worldly values upside down, presenting a radical vision of the blessed life that contradicts everything the world considers successful.</p>

<p>The word "blessed" (Greek: <em>makarios</em>) means more than happy. It describes a deep, abiding state of spiritual well-being that transcends circumstances. It is the condition of those who are right with God.</p>

<h3>Verse 3: "Blessed are the poor in spirit, for theirs is the kingdom of heaven."</h3>
<p>The first beatitude establishes the foundation for all that follows. To be "poor in spirit" is to recognize our spiritual bankruptcy before God—our utter dependence on His grace.</p>

<blockquote>This is not about material poverty or low self-esteem. It is the recognition that we bring nothing to the table of salvation except our need. The kingdom belongs to those who know they cannot earn it.</blockquote>

<p><strong>Application:</strong> Pride is the greatest barrier to entering God's kingdom. Daily cultivate an awareness of your need for God's grace. Remember that even your best works are "filthy rags" apart from Christ (Isaiah 64:6).</p>

<h3>Verse 4: "Blessed are those who mourn, for they will be comforted."</h3>
<p>This mourning is not merely grief over life's losses but a godly sorrow over sin—both personal sin and the brokenness of the world. It is the appropriate response to recognizing our spiritual poverty.</p>

<p>The comfort promised is not superficial consolation but the deep healing that comes through:</p>
<ul>
  <li>The forgiveness of sins through Christ's sacrifice</li>
  <li>The presence of the Holy Spirit, our Comforter</li>
  <li>The hope of final restoration when God will "wipe every tear" (Revelation 21:4)</li>
</ul>

<h3>Verse 5: "Blessed are the meek, for they will inherit the earth."</h3>
<p>Meekness is often misunderstood as weakness. In reality, it is strength under control—power submitted to God's purposes. Moses was called the meekest man on earth (Numbers 12:3), yet he confronted Pharaoh and led a nation.</p>

<p>The promise of inheriting the earth echoes Psalm 37:11 and points to the new creation where the redeemed will reign with Christ.</p>

<h3>Verse 6: "Blessed are those who hunger and thirst for righteousness, for they will be filled."</h3>
<p>In an arid climate like first-century Palestine, hunger and thirst were matters of life and death. Jesus uses this powerful imagery to describe the intensity with which we should desire righteousness.</p>

<p>This righteousness has three dimensions:</p>
<ol>
  <li><strong>Imputed righteousness:</strong> The righteousness of Christ credited to us through faith</li>
  <li><strong>Imparted righteousness:</strong> The progressive sanctification worked in us by the Spirit</li>
  <li><strong>Social righteousness:</strong> The longing to see justice prevail in society</li>
</ol>

<h3>Verse 7: "Blessed are the merciful, for they will be shown mercy."</h3>
<p>Mercy is compassion in action—not merely feeling pity but actively alleviating suffering. Jesus embodied mercy throughout His ministry, touching lepers, forgiving sinners, and healing the broken.</p>

<blockquote>We show mercy because we have received mercy. The forgiven become forgivers; the recipients of grace become channels of grace to others.</blockquote>

<h3>Verse 8: "Blessed are the pure in heart, for they will see God."</h3>
<p>Purity of heart refers to single-minded devotion to God—an undivided heart that seeks Him above all else. It stands in contrast to hypocrisy, where external religion masks internal corruption.</p>

<p>The promise of seeing God is staggering. While no one can see God in His full glory and live (Exodus 33:20), the pure in heart will enjoy ever-increasing intimacy with God, culminating in the beatific vision in eternity.</p>

<h3>Verse 9: "Blessed are the peacemakers, for they will be called children of God."</h3>
<p>Peacemakers actively work to reconcile people to God and to one another. This is not passive peace-keeping but active peace-making—the costly work of reconciliation.</p>

<p>They are called "children of God" because they reflect the character of their Father, who reconciled the world to Himself through Christ (2 Corinthians 5:18-19).</p>

<h3>Verses 10-12: The Blessing of Persecution</h3>
<p>"Blessed are those who are persecuted because of righteousness, for theirs is the kingdom of heaven. Blessed are you when people insult you, persecute you and falsely say all kinds of evil against you because of me. Rejoice and be glad, because great is your reward in heaven."</p>

<p>The final beatitude comes with a qualifier: persecution must be "because of righteousness" and "because of me." Suffering for our own foolishness or sin is not blessed persecution.</p>

<p>Jesus commands us to "rejoice and be glad" in persecution because:</p>
<ul>
  <li>It confirms we are genuinely following Christ</li>
  <li>It connects us to the noble line of prophets who suffered before us</li>
  <li>It carries the promise of great heavenly reward</li>
</ul>

<h3>Conclusion: The Upside-Down Kingdom</h3>
<p>The Beatitudes describe citizens of an upside-down kingdom where the last are first, the weak are strong, and the poor are rich. They are not a ladder to climb but a description of the integrated character of Christ's followers.</p>

<p>May we increasingly embody these characteristics, not in our own strength, but through the transforming power of the Holy Spirit who conforms us to the image of Christ.</p>
`,
    },
    {
      title: "The Power of Intercessory Prayer: Standing in the Gap",
      slug: "power-of-intercessory-prayer",
      categorySlug: "prayer",
      featuredImage: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=1200",
      excerpt: "Discover the biblical foundation and practical principles for effective intercessory prayer that can transform lives, communities, and nations.",
      content: `
<h2>What Is Intercessory Prayer?</h2>
<p>Intercessory prayer is the act of praying on behalf of others—standing before God as an advocate for those who cannot or will not pray for themselves. The intercessor enters the gap between God's holiness and humanity's need, pleading for mercy, healing, provision, and transformation.</p>

<p>In Ezekiel 22:30, God declares: <em>"I looked for someone among them who would build up the wall and stand before me in the gap on behalf of the land so I would not have to destroy it, but I found no one."</em> This haunting verse reveals God's desire for intercessors and the tragic consequences when none are found.</p>

<h3>Biblical Examples of Powerful Intercession</h3>

<h4>Abraham Intercedes for Sodom (Genesis 18:16-33)</h4>
<p>Abraham's bold intercession for Sodom demonstrates several principles:</p>
<ul>
  <li><strong>Friendship with God:</strong> Abraham's relationship with God gave him confidence to approach</li>
  <li><strong>Persistence:</strong> He continued negotiating from fifty righteous down to ten</li>
  <li><strong>Appeal to God's character:</strong> "Will not the Judge of all the earth do right?"</li>
  <li><strong>Humility:</strong> "I am nothing but dust and ashes"</li>
</ul>

<h4>Moses Intercedes for Israel (Exodus 32:9-14)</h4>
<p>After the golden calf incident, Moses' intercession literally saved the nation from destruction. He employed powerful arguments:</p>
<ul>
  <li>God's investment: "These are your people whom you brought out of Egypt"</li>
  <li>God's reputation: "What will the Egyptians say?"</li>
  <li>God's promises: "Remember Abraham, Isaac, and Israel"</li>
</ul>

<blockquote>The result? "Then the LORD relented and did not bring on his people the disaster he had threatened." Intercession changed the course of history.</blockquote>

<h4>Jesus: The Ultimate Intercessor</h4>
<p>Jesus is our supreme model for intercession. His High Priestly Prayer in John 17 reveals His heart for His followers. Even now, "He always lives to intercede" for us (Hebrews 7:25).</p>

<h3>Principles for Effective Intercession</h3>

<h4>1. Pray in the Spirit</h4>
<p>Romans 8:26-27 tells us that "the Spirit helps us in our weakness" when we don't know what to pray. Effective intercession requires sensitivity to the Holy Spirit's leading, sometimes praying beyond our understanding.</p>

<h4>2. Pray According to God's Will</h4>
<p>1 John 5:14-15 promises that "if we ask anything according to his will, he hears us." Study Scripture to align your prayers with God's revealed will and purposes.</p>

<h4>3. Pray with Faith</h4>
<p>James 1:6-7 warns against double-minded prayer. Approach God with confidence in His power and willingness to answer, even when circumstances seem impossible.</p>

<h4>4. Pray with Persistence</h4>
<p>Jesus taught persistence through the parable of the persistent widow (Luke 18:1-8). Don't give up when answers are delayed—continue knocking until the door opens.</p>

<h4>5. Pray with Clean Hands</h4>
<p>Psalm 66:18 warns, "If I had cherished sin in my heart, the Lord would not have listened." Effective intercession requires a clear conscience and right standing with God.</p>

<h3>A Practical Framework for Intercession</h3>

<p><strong>ACTS Model for Intercession:</strong></p>
<ol>
  <li><strong>Adoration:</strong> Begin by worshiping God for who He is</li>
  <li><strong>Confession:</strong> Clear any sin that might hinder your prayers</li>
  <li><strong>Thanksgiving:</strong> Thank God for past answers and His faithfulness</li>
  <li><strong>Supplication:</strong> Bring specific requests for others before God</li>
</ol>

<h3>Areas for Regular Intercession</h3>
<p>Consider developing prayer lists in these categories:</p>

<p><strong>Family:</strong> Spouse, children, parents, extended family members—their salvation, protection, growth, and needs.</p>

<p><strong>Church:</strong> Pastors, leaders, missionaries, ministries, unity, and spiritual vitality.</p>

<p><strong>Community:</strong> Neighbors, local government, schools, businesses, and the spread of the gospel locally.</p>

<p><strong>Nation:</strong> Government leaders, justice systems, moral issues, revival, and reformation.</p>

<p><strong>World:</strong> Persecuted believers, unreached people groups, global crises, and the completion of the Great Commission.</p>

<h3>The Cost and Reward of Intercession</h3>
<p>Intercession is not easy. It requires time, energy, emotional investment, and spiritual warfare. But the rewards are eternal:</p>
<ul>
  <li>Intimacy with God deepens as we share His heart for others</li>
  <li>Lives are transformed through our prayers</li>
  <li>We participate in God's redemptive work in the world</li>
  <li>Treasures are laid up in heaven that will never fade</li>
</ul>

<blockquote>"The one concern of the devil is to keep Christians from praying. He fears nothing from prayerless studies, prayerless work, and prayerless religion. He laughs at our toil, mocks at our wisdom, but trembles when we pray." — Samuel Chadwick</blockquote>

<h3>Conclusion: Will You Stand in the Gap?</h3>
<p>God is still looking for intercessors who will stand in the gap. Will you answer the call? Begin today by committing to regular, focused intercession for those God places on your heart.</p>

<p>The world may never know the names of faithful intercessors, but heaven records every prayer, and eternity will reveal their impact.</p>
`,
    },
    {
      title: "Building a Christ-Centered Marriage: Foundations for Lifelong Love",
      slug: "christ-centered-marriage",
      categorySlug: "family-marriage",
      featuredImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200",
      excerpt: "Practical biblical wisdom for building a marriage that honors God, strengthens both partners, and creates a legacy of faith for generations.",
      content: `
<h2>The Divine Design for Marriage</h2>
<p>Marriage is not a human invention but a divine institution. In Genesis 2:24, God established the foundational principle: "For this reason a man will leave his father and mother and be united to his wife, and they will become one flesh."</p>

<p>This "one flesh" union is more than physical—it encompasses emotional, spiritual, and purposeful unity. Marriage reflects the relationship between Christ and His church (Ephesians 5:31-32), making it a profound mystery with eternal significance.</p>

<h3>Three Pillars of a Christ-Centered Marriage</h3>

<h4>Pillar 1: Covenant Commitment</h4>
<p>In a culture of disposable relationships, Christian marriage stands as a covenant—a binding agreement witnessed by God Himself. Malachi 2:14 calls the wife "your partner, the wife of your marriage covenant."</p>

<p>Covenant commitment means:</p>
<ul>
  <li><strong>Unconditional love:</strong> Choosing to love even when feelings fluctuate</li>
  <li><strong>Permanence:</strong> "Till death do us part" is not just tradition but vow</li>
  <li><strong>Exclusivity:</strong> Forsaking all others emotionally, physically, and spiritually</li>
  <li><strong>Sacrificial service:</strong> Putting your spouse's needs above your own</li>
</ul>

<blockquote>A covenant is not a contract that can be broken when terms aren't met. It is a sacred promise that declares, "I am committed to you regardless of circumstances."</blockquote>

<h4>Pillar 2: Complementary Roles</h4>
<p>Ephesians 5:22-33 outlines complementary roles for husbands and wives—not as a hierarchy of worth but as a partnership of function.</p>

<p><strong>For Husbands: Sacrificial Leadership</strong></p>
<p>"Husbands, love your wives, just as Christ loved the church and gave himself up for her" (v. 25). This is not domineering authority but servant leadership that:</p>
<ul>
  <li>Initiates sacrificial love</li>
  <li>Provides spiritual direction</li>
  <li>Protects and nurtures</li>
  <li>Honors and cherishes</li>
</ul>

<p><strong>For Wives: Respectful Partnership</strong></p>
<p>"Wives, submit yourselves to your own husbands as you do to the Lord" (v. 22). This is not subservience but voluntary alignment that:</p>
<ul>
  <li>Respects husband's role without demanding perfection</li>
  <li>Supports his leadership while offering wisdom</li>
  <li>Creates a safe environment for him to lead</li>
  <li>Models the church's relationship to Christ</li>
</ul>

<h4>Pillar 3: Christ-Centered Communion</h4>
<p>The strongest marriages are triangular—with Christ at the apex and husband and wife at the base. As each spouse draws closer to Christ, they naturally draw closer to each other.</p>

<p>Practices that foster Christ-centered communion:</p>
<ol>
  <li><strong>Pray together daily:</strong> Even five minutes of shared prayer creates profound intimacy</li>
  <li><strong>Study Scripture together:</strong> Let God's Word be the foundation of your decisions</li>
  <li><strong>Worship together:</strong> Regular church attendance and private worship as a couple</li>
  <li><strong>Serve together:</strong> Ministry partnership deepens marital partnership</li>
  <li><strong>Practice forgiveness:</strong> Regularly extend and receive grace</li>
</ol>

<h3>Communication: The Lifeblood of Marriage</h3>
<p>Ephesians 4:29 provides the standard: "Do not let any unwholesome talk come out of your mouths, but only what is helpful for building others up according to their needs."</p>

<p><strong>Five Rules for Healthy Communication:</strong></p>
<ol>
  <li><strong>Speak the truth in love:</strong> Honesty without cruelty, truth with tenderness</li>
  <li><strong>Listen to understand:</strong> Seek first to understand, then to be understood</li>
  <li><strong>Don't let the sun go down on anger:</strong> Resolve conflicts before they fester</li>
  <li><strong>Use "I" statements:</strong> Share feelings without accusations</li>
  <li><strong>Affirm regularly:</strong> Express appreciation and admiration daily</li>
</ol>

<h3>Navigating Conflict Biblically</h3>
<p>Conflict is inevitable in marriage; how we handle it determines whether it destroys or strengthens us.</p>

<p><strong>The Matthew 18 Principle:</strong></p>
<ul>
  <li>Go directly to your spouse (not parents, friends, or social media)</li>
  <li>Address specific behaviors, not character attacks</li>
  <li>Seek resolution, not victory</li>
  <li>Be willing to forgive—seventy times seven if necessary</li>
</ul>

<blockquote>In conflict, remember: your spouse is not your enemy. You are on the same team fighting against the real enemy who seeks to destroy your marriage.</blockquote>

<h3>Intimacy: God's Gift to Marriage</h3>
<p>Physical intimacy within marriage is a gift from God, not a concession to weakness. The Song of Solomon celebrates romantic love, and 1 Corinthians 7:3-5 commands mutual generosity.</p>

<p>Cultivate intimacy through:</p>
<ul>
  <li>Prioritizing time alone together</li>
  <li>Maintaining emotional connection</li>
  <li>Communicating needs and desires openly</li>
  <li>Guarding against anything that would compromise purity</li>
</ul>

<h3>Building a Legacy</h3>
<p>Your marriage is not just about you—it's about the generations that follow. Deuteronomy 6:6-7 commands parents to impress God's commandments on their children, "talking about them when you sit at home and when you walk along the road."</p>

<p>A Christ-centered marriage models for children:</p>
<ul>
  <li>How to resolve conflict with grace</li>
  <li>How to love sacrificially</li>
  <li>How to prioritize faith</li>
  <li>How to weather life's storms</li>
</ul>

<h3>Conclusion: The Long Obedience</h3>
<p>Building a Christ-centered marriage is not accomplished in a day—it is what Eugene Peterson called "a long obedience in the same direction." Day by day, choice by choice, you build something beautiful that glorifies God and blesses generations.</p>

<p>May your marriage be a living testimony of Christ's love for His church—faithful, sacrificial, and eternal.</p>
`,
    },
    {
      title: "Morning Devotional: Finding Strength for Today",
      slug: "morning-devotional-strength",
      categorySlug: "devotionals",
      featuredImage: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200",
      excerpt: "Begin your day anchored in God's promises with this devotional guide on drawing strength from the Lord for whatever challenges await.",
      content: `
<h2>Scripture: Isaiah 40:28-31</h2>
<blockquote>"Do you not know? Have you not heard? The LORD is the everlasting God, the Creator of the ends of the earth. He will not grow tired or weary, and his understanding no one can fathom. He gives strength to the weary and increases the power of the weak. Even youths grow tired and weary, and young men stumble and fall; but those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint."</blockquote>

<h3>Reflection</h3>
<p>Have you ever started a day already feeling exhausted? Perhaps you faced a sleepless night, carry ongoing burdens, or simply feel the weight of life's demands pressing down. This passage in Isaiah speaks directly to that weariness.</p>

<p>The prophet Isaiah wrote these words to a people in exile—displaced, discouraged, and drained. They wondered if God had forgotten them. Sound familiar?</p>

<p>Into their exhaustion, God speaks a powerful truth: <strong>His strength is not like ours.</strong></p>

<p>Notice the contrast Isaiah draws:</p>
<ul>
  <li>We grow tired—He never does</li>
  <li>We are limited—His understanding is infinite</li>
  <li>Even the strongest among us (youths) eventually stumble</li>
  <li>But those who hope in the LORD find supernatural renewal</li>
</ul>

<h3>Three Levels of Strength</h3>
<p>The passage describes three levels of divine empowerment:</p>

<p><strong>1. Soaring:</strong> Those moments of spiritual exhilaration when we feel lifted above our circumstances, seeing from God's perspective.</p>

<p><strong>2. Running:</strong> The active seasons of service and productivity where we work hard but don't burn out because His strength sustains us.</p>

<p><strong>3. Walking:</strong> The daily grind of ordinary faithfulness—putting one foot in front of the other when there are no wings, no wind, just the steady presence of God.</p>

<p>Perhaps walking is the greatest miracle of all. Anyone can soar in a moment of inspiration. But to walk faithfully, day after day, year after year—that requires the deepest kind of strength.</p>

<h3>The Key: "Hope in the LORD"</h3>
<p>The Hebrew word translated "hope" is <em>qavah</em>, which means to wait with expectation, to look eagerly. It's not passive resignation but active anticipation.</p>

<p>To hope in the LORD means:</p>
<ul>
  <li>Expecting Him to act according to His character</li>
  <li>Waiting on His timing rather than forcing our own</li>
  <li>Drawing near to Him in prayer and worship</li>
  <li>Trusting His promises even when circumstances seem contrary</li>
</ul>

<h3>Prayer</h3>
<p><em>Everlasting God, Creator of heaven and earth, I come to You this morning acknowledging my weakness. I don't have the strength for what this day may bring. But You do.</em></p>

<p><em>I place my hope in You—not in my abilities, my resources, or my plans. Renew my strength according to Your promise. Help me to soar when You give wings, to run when You give energy, and to walk faithfully when You call me to simple obedience.</em></p>

<p><em>Thank You that Your strength never fails, Your understanding never falters, and Your love never ends. I trust You with this day and all it holds.</em></p>

<p><em>In Jesus' name, Amen.</em></p>

<h3>Today's Challenge</h3>
<p>When you feel your strength flagging today—and you will—pause and whisper: "Lord, I'm trusting You for strength right now." Don't try to manufacture energy through sheer willpower. Instead, draw from the inexhaustible well of God's power through simple, moment-by-moment dependence.</p>

<p>Write Isaiah 40:31 on a card and place it where you'll see it throughout the day. Let it remind you that God's strength is available—not just for the big crises, but for the ordinary moments that make up most of our lives.</p>

<h3>Going Deeper</h3>
<p>For further study, meditate on these related passages:</p>
<ul>
  <li>Psalm 73:26 - "My flesh and my heart may fail, but God is the strength of my heart"</li>
  <li>2 Corinthians 12:9-10 - "My power is made perfect in weakness"</li>
  <li>Philippians 4:13 - "I can do all things through Christ who strengthens me"</li>
  <li>Nehemiah 8:10 - "The joy of the LORD is your strength"</li>
</ul>
`,
    },
    {
      title: "Understanding the Book of Romans: A Chapter-by-Chapter Overview",
      slug: "book-of-romans-overview",
      categorySlug: "bible-study",
      featuredImage: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=1200",
      excerpt: "A comprehensive guide to Paul's masterpiece of Christian theology, exploring the doctrines of sin, salvation, sanctification, and service.",
      content: `
<h2>Introduction to Romans</h2>
<p>The Book of Romans stands as the most systematic presentation of Christian doctrine in the New Testament. Written by the Apostle Paul around AD 57, this letter has shaped Christian theology more than any other biblical book outside the Gospels.</p>

<p>Martin Luther called Romans "the very purest Gospel." John Calvin wrote, "When anyone gains a knowledge of this Epistle, he has an entrance opened to him to all the most hidden treasures of Scripture."</p>

<h3>The Structure of Romans</h3>
<p>Romans can be divided into four major sections:</p>
<ol>
  <li><strong>Chapters 1-4:</strong> The Problem of Sin and the Solution of Justification</li>
  <li><strong>Chapters 5-8:</strong> The Results of Justification and Sanctification</li>
  <li><strong>Chapters 9-11:</strong> God's Plan for Israel and the Gentiles</li>
  <li><strong>Chapters 12-16:</strong> Practical Christian Living</li>
</ol>

<h3>Chapters 1-4: Sin and Justification</h3>

<h4>Chapter 1: The Wrath of God Against Unrighteousness</h4>
<p>After his greeting (1:1-17), Paul launches into a devastating indictment of humanity. The Gentile world stands condemned because:</p>
<ul>
  <li>God's existence is evident in creation (v. 20)</li>
  <li>They suppressed this truth (v. 18)</li>
  <li>They exchanged God's glory for idols (v. 23)</li>
  <li>God gave them over to their desires (vv. 24, 26, 28)</li>
</ul>

<blockquote>The famous phrase "For I am not ashamed of the gospel" (1:16) introduces Paul's thesis: the gospel is God's power for salvation to everyone who believes.</blockquote>

<h4>Chapter 2: The Jews Also Stand Condemned</h4>
<p>Paul turns to his Jewish audience, showing that possession of the Law provides no exemption from judgment. What matters is not having the Law but obeying it.</p>

<h4>Chapter 3: All Have Sinned</h4>
<p>Paul's conclusion is devastating and universal: "There is no one righteous, not even one" (3:10). But this dark diagnosis sets up the glorious remedy:</p>
<ul>
  <li>Righteousness comes through faith in Jesus Christ (v. 22)</li>
  <li>It is a gift of grace (v. 24)</li>
  <li>Christ is the atoning sacrifice (v. 25)</li>
  <li>Boasting is excluded—salvation is by faith alone (vv. 27-28)</li>
</ul>

<h4>Chapter 4: Abraham - The Example of Faith</h4>
<p>Using Abraham as his primary example, Paul demonstrates that justification by faith is not a new doctrine but the pattern God has always used. Abraham "believed God, and it was credited to him as righteousness" (4:3).</p>

<h3>Chapters 5-8: Justification's Results</h3>

<h4>Chapter 5: Peace with God and Hope of Glory</h4>
<p>Justification produces immediate benefits:</p>
<ul>
  <li>Peace with God (v. 1)</li>
  <li>Access to grace (v. 2)</li>
  <li>Hope of glory (v. 2)</li>
  <li>Joy even in suffering (vv. 3-5)</li>
  <li>God's love poured into our hearts (v. 5)</li>
</ul>

<p>Paul then draws a contrast between Adam and Christ: through Adam sin and death entered; through Christ righteousness and life abound (vv. 12-21).</p>

<h4>Chapter 6: Dead to Sin, Alive to God</h4>
<p>Paul addresses a critical objection: if grace abounds where sin abounds, should we keep sinning? "By no means!" (v. 2). Through baptism, we have died with Christ and been raised to new life. Sin's dominion is broken.</p>

<h4>Chapter 7: The Struggle with Sin</h4>
<p>In perhaps the most psychologically honest passage in Scripture, Paul describes the ongoing struggle with sin: "I do not do the good I want to do, but the evil I do not want to do—this I keep on doing" (v. 19).</p>

<h4>Chapter 8: Life in the Spirit</h4>
<p>Chapter 8 may be the most glorious chapter in the Bible:</p>
<ul>
  <li>No condemnation for those in Christ (v. 1)</li>
  <li>The Spirit gives life (vv. 2-11)</li>
  <li>We are children and heirs of God (vv. 14-17)</li>
  <li>Present sufferings cannot compare to future glory (v. 18)</li>
  <li>All things work together for good (v. 28)</li>
  <li>Nothing can separate us from God's love (vv. 38-39)</li>
</ul>

<blockquote>"If God is for us, who can be against us?" (8:31) - This rhetorical question echoes through the ages as an anchor for the believer's soul.</blockquote>

<h3>Chapters 9-11: Israel and God's Plan</h3>
<p>Paul wrestles with a painful question: if the gospel is for all, why have most Jews rejected it? His answer unfolds across three chapters:</p>
<ul>
  <li><strong>Chapter 9:</strong> God's sovereign choice in election</li>
  <li><strong>Chapter 10:</strong> Israel's responsibility and the universal offer of salvation</li>
  <li><strong>Chapter 11:</strong> God's future plan to restore Israel</li>
</ul>

<p>The section culminates in a doxology: "Oh, the depth of the riches of the wisdom and knowledge of God!" (11:33)</p>

<h3>Chapters 12-16: Practical Living</h3>

<h4>Chapter 12: Living Sacrifices</h4>
<p>The famous opening: "Offer your bodies as a living sacrifice... Do not conform to the pattern of this world, but be transformed by the renewing of your mind" (vv. 1-2). Paul then describes life in the body of Christ.</p>

<h4>Chapter 13: Submission to Authorities and Love for Neighbors</h4>
<p>Christians should be model citizens while remembering that "love is the fulfillment of the law" (v. 10).</p>

<h4>Chapters 14-15: The Weak and the Strong</h4>
<p>Paul addresses practical disputes about food and holy days, calling for mutual acceptance and consideration of weaker brothers.</p>

<h4>Chapter 16: Greetings and Final Warnings</h4>
<p>The personal greetings reveal a diverse community of men and women, Jews and Gentiles, united in Christ.</p>

<h3>Conclusion: The Gospel in Full</h3>
<p>Romans presents the complete gospel: humanity's desperate need, God's gracious provision, the believer's transformation, and the community's calling. To know Romans is to know the heart of the Christian faith.</p>

<p>May we not only study these truths but live them, for as Paul wrote, "the righteous will live by faith" (1:17).</p>
`,
    },
    {
      title: "Reaching the Next Generation: Youth Ministry in the Digital Age",
      slug: "youth-ministry-digital-age",
      categorySlug: "youth-ministry",
      featuredImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200",
      excerpt: "Strategies for effectively discipling young people in an age of smartphones, social media, and unprecedented cultural challenges.",
      content: `
<h2>The Challenge of Reaching Gen Z</h2>
<p>Today's young people live in a world their parents and grandparents could never have imagined. They have grown up with smartphones in their hands, social media shaping their identities, and information available at the speed of thought. They face unique pressures—mental health challenges, identity confusion, and a culture that often opposes biblical values.</p>

<p>Yet God's heart for the young has not changed. Psalm 78:4 declares: "We will not hide them from their descendants; we will tell the next generation the praiseworthy deeds of the LORD, his power, and the wonders he has done."</p>

<h3>Understanding the Digital Native</h3>
<p>Before we can reach young people, we must understand them:</p>

<h4>Characteristics of Gen Z (born 1997-2012):</h4>
<ul>
  <li><strong>Digital natives:</strong> They don't remember life before the internet</li>
  <li><strong>Visual learners:</strong> They consume content primarily through images and video</li>
  <li><strong>Short attention spans:</strong> They're used to rapid-fire, bite-sized content</li>
  <li><strong>Authenticity seekers:</strong> They can spot fake from a mile away</li>
  <li><strong>Anxious generation:</strong> They face unprecedented rates of depression and anxiety</li>
  <li><strong>Diverse and inclusive:</strong> They value diversity and reject exclusivism</li>
</ul>

<blockquote>The question is not whether to engage young people where they are—we must. The question is how to do so without compromising the gospel's truth and power.</blockquote>

<h3>Principles for Effective Youth Ministry</h3>

<h4>1. Relationship Over Program</h4>
<p>Young people don't want to be another number in a program. They want to be known—truly known—by adults who care about them. Jesus modeled this: He invested deeply in twelve, most deeply in three.</p>

<p>Practical steps:</p>
<ul>
  <li>Train leaders to learn students' names, stories, and struggles</li>
  <li>Create small group environments where relationships can deepen</li>
  <li>Encourage mentoring relationships between adults and students</li>
  <li>Be present at their events—games, performances, everyday moments</li>
</ul>

<h4>2. Authenticity Over Performance</h4>
<p>This generation has a finely tuned hypocrisy detector. They'd rather see a leader who admits struggles than one who pretends to have it all together.</p>

<p>This means:</p>
<ul>
  <li>Share your own faith journey, including doubts and difficulties</li>
  <li>Admit when you don't know the answer</li>
  <li>Let them see your genuine walk with God, not just your polished teaching</li>
  <li>Create space for honest questions without judgment</li>
</ul>

<h4>3. Experience Over Information</h4>
<p>In an age of information overload, young people don't need more data—they need encounters with the living God.</p>

<p>Design ministry experiences that:</p>
<ul>
  <li>Engage multiple senses in worship and teaching</li>
  <li>Provide opportunities for service and mission</li>
  <li>Create space for silence, reflection, and hearing from God</li>
  <li>Use retreats and camps for transformational moments</li>
</ul>

<h4>4. Depth Over Entertainment</h4>
<p>Contrary to popular belief, young people are hungry for substance. They're tired of being entertained; they want to be transformed.</p>

<p>Don't dumb down the gospel:</p>
<ul>
  <li>Teach the hard passages, not just the comfortable ones</li>
  <li>Challenge them with the demands of discipleship</li>
  <li>Invite them into spiritual disciplines: prayer, fasting, Bible study</li>
  <li>Discuss tough cultural issues from a biblical worldview</li>
</ul>

<h3>Leveraging Technology Wisely</h3>
<p>Technology is a tool—it can be used for good or ill. Here's how to leverage it:</p>

<h4>Use Digital Platforms for Connection:</h4>
<ul>
  <li>Maintain an active social media presence where students are</li>
  <li>Send encouraging texts throughout the week</li>
  <li>Create shareable content that reinforces teaching</li>
  <li>Use apps for Bible reading plans and accountability</li>
</ul>

<h4>But Also Teach Digital Discernment:</h4>
<ul>
  <li>Discuss the dangers of social media comparison and addiction</li>
  <li>Teach critical thinking about online content</li>
  <li>Model healthy technology boundaries</li>
  <li>Create phone-free spaces for deep connection</li>
</ul>

<h3>Addressing Mental Health</h3>
<p>We cannot ignore the mental health crisis among young people. The church must be a place of hope and healing:</p>

<ul>
  <li>Train leaders to recognize warning signs of depression and suicidal ideation</li>
  <li>Destigmatize mental health discussions</li>
  <li>Partner with Christian counselors and mental health professionals</li>
  <li>Teach biblical truth about identity, worth, and hope</li>
  <li>Create safe spaces where students can share their struggles</li>
</ul>

<blockquote>The gospel speaks directly to the identity questions this generation is asking: "Who am I? Why am I here? Do I matter?" Our calling is to connect them to the One who answers those questions with love.</blockquote>

<h3>Partnering with Parents</h3>
<p>Youth ministry cannot succeed in isolation. Deuteronomy 6 places the primary responsibility for spiritual formation on parents. Our role is to partner with families:</p>

<ul>
  <li>Communicate regularly with parents about what students are learning</li>
  <li>Equip parents with tools for spiritual conversations at home</li>
  <li>Involve families in ministry events</li>
  <li>Support parents who are struggling with their own faith</li>
</ul>

<h3>Conclusion: Hope for the Next Generation</h3>
<p>Despite the challenges, there has never been a more exciting time for youth ministry. This generation is hungry for truth, desperate for authentic community, and ready to be mobilized for mission.</p>

<p>Our calling is clear: "Train up a child in the way he should go; even when he is old he will not depart from it" (Proverbs 22:6). With prayer, wisdom, and Spirit-empowered love, we can reach the next generation for Christ.</p>

<p>The harvest is plentiful. Will you answer the call?</p>
`,
    },
    {
      title: "The Attributes of God: Understanding Who God Is",
      slug: "attributes-of-god",
      categorySlug: "teachings",
      featuredImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200",
      excerpt: "An exploration of God's essential characteristics—His holiness, love, sovereignty, and more—and how understanding them transforms our faith.",
      content: `
<h2>Why Study God's Attributes?</h2>
<p>A.W. Tozer wrote, "What comes into our minds when we think about God is the most important thing about us." Our view of God shapes everything—how we pray, how we worship, how we face trials, how we treat others.</p>

<p>To know God's attributes is not merely academic exercise; it is the foundation of authentic relationship with Him. As we understand who He is, we are drawn to worship, trust, and obey.</p>

<h3>The Incommunicable Attributes</h3>
<p>These are attributes that belong to God alone—they cannot be shared with creatures:</p>

<h4>1. Self-Existence (Aseity)</h4>
<p>God depends on nothing outside Himself for His existence. He declared to Moses, "I AM WHO I AM" (Exodus 3:14). Everything else exists because of Him; He exists because of nothing but Himself.</p>

<p><strong>Implication:</strong> God is the ultimate reality. Our existence depends entirely on Him, while His existence depends on nothing.</p>

<h4>2. Immutability</h4>
<p>"I the LORD do not change" (Malachi 3:6). God's character, purposes, and promises remain constant. He doesn't grow, improve, or decline.</p>

<p><strong>Implication:</strong> We can trust God's promises completely. What He was yesterday, He is today and will be forever (Hebrews 13:8).</p>

<h4>3. Eternality</h4>
<p>God exists outside of time. Psalm 90:2 declares, "Before the mountains were born or you brought forth the whole world, from everlasting to everlasting you are God."</p>

<p><strong>Implication:</strong> God sees all of history—past, present, and future—simultaneously. He is never surprised, never caught off guard.</p>

<h4>4. Omnipresence</h4>
<p>God is fully present everywhere. Psalm 139:7-10 asks, "Where can I go from your Spirit? Where can I flee from your presence?"</p>

<p><strong>Implication:</strong> There is no place we can go where God is not already fully there. We are never alone.</p>

<h4>5. Omniscience</h4>
<p>God knows all things—actual and possible, past, present, and future. "Nothing in all creation is hidden from God's sight" (Hebrews 4:13).</p>

<p><strong>Implication:</strong> God needs no advisors. He knows exactly what you need before you ask (Matthew 6:8).</p>

<h4>6. Omnipotence</h4>
<p>"Is anything too hard for the LORD?" (Genesis 18:14). God can do all things that are consistent with His nature.</p>

<p><strong>Implication:</strong> Nothing is impossible for God. No situation is beyond His power to redeem.</p>

<blockquote>These attributes remind us that God is wholly other—transcendent beyond our full comprehension, yet graciously revealing Himself that we might know Him.</blockquote>

<h3>The Communicable Attributes</h3>
<p>These are attributes that God shares with us in finite measure:</p>

<h4>1. Holiness</h4>
<p>God is absolutely pure, set apart from all sin. The seraphim cry, "Holy, holy, holy is the LORD Almighty" (Isaiah 6:3)—the only attribute repeated three times for emphasis.</p>

<p><strong>Our Response:</strong> "Be holy, because I am holy" (1 Peter 1:16). God calls us to pursue purity in thought, word, and deed.</p>

<h4>2. Love</h4>
<p>"God is love" (1 John 4:8). This is not merely an attribute but His very essence. His love is:</p>
<ul>
  <li><strong>Unconditional:</strong> Not based on our worthiness</li>
  <li><strong>Sacrificial:</strong> Demonstrated supremely at the cross</li>
  <li><strong>Everlasting:</strong> "I have loved you with an everlasting love" (Jeremiah 31:3)</li>
</ul>

<p><strong>Our Response:</strong> "We love because he first loved us" (1 John 4:19). Receive His love, then pour it out to others.</p>

<h4>3. Righteousness and Justice</h4>
<p>"Righteousness and justice are the foundation of your throne" (Psalm 89:14). God always does what is right and fair.</p>

<p><strong>Our Response:</strong> "Seek first his kingdom and his righteousness" (Matthew 6:33). Pursue justice for the oppressed.</p>

<h4>4. Mercy and Grace</h4>
<p>Mercy is not getting the punishment we deserve; grace is getting the blessing we don't deserve. Ephesians 2:4-5 declares, "Because of his great love for us, God, who is rich in mercy, made us alive with Christ even when we were dead in transgressions."</p>

<p><strong>Our Response:</strong> "Be merciful, just as your Father is merciful" (Luke 6:36). Extend grace to others as freely as you've received it.</p>

<h4>5. Faithfulness</h4>
<p>"Great is your faithfulness" (Lamentations 3:23). God keeps every promise, fulfills every covenant, never abandons His own.</p>

<p><strong>Our Response:</strong> Trust Him completely, even when circumstances seem contrary to His promises.</p>

<h4>6. Wisdom</h4>
<p>God's wisdom is the perfect application of His knowledge. Romans 11:33 exclaims, "Oh, the depth of the riches of the wisdom and knowledge of God!"</p>

<p><strong>Our Response:</strong> "If any of you lacks wisdom, you should ask God, who gives generously" (James 1:5). Seek His wisdom daily.</p>

<h3>The Trinity: One God in Three Persons</h3>
<p>While not an "attribute" per se, the doctrine of the Trinity is essential to understanding who God is: one God eternally existing in three persons—Father, Son, and Holy Spirit—equal in essence, distinct in role.</p>

<p>This mystery reveals:</p>
<ul>
  <li>God has always existed in community</li>
  <li>Love has always existed within the Godhead</li>
  <li>Each Person plays a distinct role in our salvation</li>
</ul>

<h3>Conclusion: From Knowledge to Worship</h3>
<p>The proper response to studying God's attributes is not merely understanding but worship. As we contemplate His greatness, we are moved to:</p>

<ul>
  <li><strong>Adoration:</strong> Praising Him for who He is</li>
  <li><strong>Trust:</strong> Resting in His character</li>
  <li><strong>Obedience:</strong> Submitting to His righteous will</li>
  <li><strong>Transformation:</strong> Becoming more like Him</li>
</ul>

<p>May our study of God's attributes never remain in our heads alone but descend to our hearts and overflow in lives of worship and service.</p>

<blockquote>"Oh, the depth of the riches of the wisdom and knowledge of God! How unsearchable his judgments, and his paths beyond tracing out! For from him and through him and for him are all things. To him be the glory forever! Amen." — Romans 11:33, 36</blockquote>
`,
    },
  ];

  // Create all posts
  for (const postData of postsData) {
    const post = await prisma.post.upsert({
      where: { slug: postData.slug },
      update: {},
      create: {
        title: postData.title,
        slug: postData.slug,
        content: postData.content.trim(),
        excerpt: postData.excerpt,
        featuredImage: postData.featuredImage,
        status: "published",
        categoryId: categories[postData.categorySlug],
        publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
      },
    });
    console.log("Post created:", post.title);
  }

  // Create Comments for posts
  const commentsData = [
    {
      postSlug: "cost-of-discipleship",
      comments: [
        { name: "Sarah Johnson", email: "sarah@example.com", message: "This article deeply convicted me. I've been a Christian for years but never truly counted the cost. Thank you for this challenging word." },
        { name: "Michael Chen", email: "michael@example.com", message: "The Bonhoeffer quote hit me hard. 'When Christ calls a man, he bids him come and die.' Lord, help me to live this out daily." },
        { name: "Pastor David Williams", email: "david@church.org", message: "I'm planning to use this as a teaching resource for our new members class. The three dimensions of discipleship cost are so clearly explained." },
        { name: "Grace Okonkwo", email: "grace@example.com", message: "Reading this in Nigeria where following Christ can literally cost everything. Praying for strength for all believers facing persecution." },
        { name: "Tom Anderson", message: "Finally, someone who isn't afraid to preach the full gospel! So much watered-down teaching these days." },
      ],
    },
    {
      postSlug: "understanding-beatitudes-commentary",
      comments: [
        { name: "Dr. Elizabeth Moore", email: "emoore@seminary.edu", message: "Excellent exegesis! Your treatment of 'makarios' as spiritual well-being rather than mere happiness is spot-on. Well done." },
        { name: "James Peterson", message: "I've read the Beatitudes hundreds of times but never understood them this deeply. The 'upside-down kingdom' concept really opened my eyes." },
        { name: "Maria Santos", email: "maria@example.com", message: "The section on purity of heart - 'single-minded devotion to God' - is exactly what I needed to hear. Struggling with divided loyalties." },
        { name: "Rev. Robert Kim", email: "rkim@church.org", message: "Would love to see you expand this into a full commentary on the Sermon on the Mount. This is exactly the kind of teaching the church needs." },
      ],
    },
    {
      postSlug: "power-of-intercessory-prayer",
      comments: [
        { name: "Praying Grandmother", message: "I've been interceding for my grandchildren for 20 years. This article reminds me why I must never stop. God is faithful!" },
        { name: "Daniel Wright", email: "dan@example.com", message: "The Samuel Chadwick quote about the devil trembling when we pray - powerful! Printing this out for my prayer closet." },
        { name: "Intercessor Network", email: "info@intercessors.org", message: "Thank you for emphasizing the cost of intercession. It's not glamorous work, but it's kingdom work." },
        { name: "Lisa Thompson", email: "lisa@example.com", message: "Started using the ACTS framework this week and my prayer life has been transformed. Thank you!" },
        { name: "Marcus Johnson", message: "Moses' intercession saving Israel is such a powerful example. Makes me wonder what disasters have been averted by faithful prayer warriors we'll never know about until heaven." },
        { name: "Prayer Warrior", email: "pw@example.com", message: "Can you write more about spiritual warfare in prayer? That's an area where I need more teaching." },
      ],
    },
    {
      postSlug: "christ-centered-marriage",
      comments: [
        { name: "Married 35 Years", email: "happywife@example.com", message: "Wish we had this teaching when we first married! Every young couple in your church should read this." },
        { name: "John & Mary Smith", email: "smiths@example.com", message: "Reading this together as our weekly marriage devotional. The section on communication rules has already helped us argue better!" },
        { name: "Struggling Husband", message: "The part about sacrificial leadership not being domineering authority... I needed to hear that. Been doing it wrong." },
        { name: "Wedding Officiant", email: "pastor@church.org", message: "I'm recommending this to all couples I counsel for marriage. The three pillars framework is perfect for premarital counseling." },
        { name: "Newlywed", email: "newlywed@example.com", message: "Six months married and already struggling. This gives me hope that a Christ-centered marriage is possible." },
      ],
    },
    {
      postSlug: "morning-devotional-strength",
      comments: [
        { name: "Early Riser", message: "Read this at 5am and it set my whole day on the right foundation. The prayer at the end was exactly what I needed." },
        { name: "Exhausted Mom", email: "tiredmom@example.com", message: "The three levels of strength - soaring, running, walking - spoke to me. Most days I'm just walking. Good to know that counts too." },
        { name: "Cancer Patient", email: "fighter@example.com", message: "Going through chemo and this verse from Isaiah has become my lifeline. Thank you for unpacking it so beautifully." },
        { name: "Student", message: "Finals week and I needed this. Writing Isaiah 40:31 on my desk right now." },
      ],
    },
    {
      postSlug: "book-of-romans-overview",
      comments: [
        { name: "Bible Study Leader", email: "leader@example.com", message: "This overview will be perfect for introducing Romans to my small group. Clear, comprehensive, and devotional." },
        { name: "Theology Student", email: "student@seminary.edu", message: "Great summary! Would recommend Moo's commentary for anyone wanting to go deeper. But this is an excellent starting point." },
        { name: "New Christian", message: "I've been intimidated by Romans. This breakdown makes it feel approachable. Starting to read it today!" },
        { name: "Pastor Mark", email: "mark@church.org", message: "The structure you outlined (4 major sections) is exactly how I teach it. Glad to see others presenting it this way." },
        { name: "Reformed Baptist", email: "rb@example.com", message: "Chapter 8 really is the most glorious chapter in the Bible! 'No condemnation' - what a promise!" },
      ],
    },
    {
      postSlug: "youth-ministry-digital-age",
      comments: [
        { name: "Youth Pastor", email: "yp@church.org", message: "Finally, practical advice that understands both the opportunities and dangers of technology. Sharing with my volunteer team." },
        { name: "Concerned Parent", email: "parent@example.com", message: "Thank you for addressing mental health. My teenager struggles with anxiety and it's comforting to know the church is taking this seriously." },
        { name: "Gen Z Reader", email: "genz@example.com", message: "As a 19-year-old, I can confirm - we DO want depth, not entertainment. Please keep challenging us!" },
        { name: "Children's Director", email: "cd@church.org", message: "Though I work with younger kids, these principles apply. Building for the handoff to youth ministry." },
        { name: "High School Teacher", message: "I see these students every day. Everything in this article is accurate. The church needs to step up." },
      ],
    },
    {
      postSlug: "attributes-of-god",
      comments: [
        { name: "Theology Nerd", email: "theo@example.com", message: "Love the distinction between communicable and incommunicable attributes. Clear taxonomy helps us think clearly about God." },
        { name: "Worship Leader", email: "worship@church.org", message: "This is going to inform how I lead worship. We need to sing about ALL of God's attributes, not just His love." },
        { name: "Skeptic Turned Believer", message: "The immutability section answered a question I had for years - how can God be the same if the OT seems different from the NT?" },
        { name: "Sunday School Teacher", email: "teacher@example.com", message: "Printing the list of attributes with Scripture references for my class. This is gold!" },
        { name: "Philosophy Major", email: "phil@university.edu", message: "Appreciate the engagement with classical theism while remaining devotional. Hard balance to strike." },
        { name: "Anonymous", message: "The Tozer quote at the beginning... convicting. What DO I really think about God? Time for honest reflection." },
      ],
    },
  ];

  // Create comments
  for (const postComments of commentsData) {
    const post = await prisma.post.findUnique({ where: { slug: postComments.postSlug } });
    if (post) {
      for (const comment of postComments.comments) {
        await prisma.comment.create({
          data: {
            name: comment.name,
            email: comment.email || null,
            message: comment.message,
            postId: post.id,
            approved: true,
            createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last 7 days
          },
        });
      }
      console.log(`Comments created for: ${postComments.postSlug}`);
    }
  }

  // Create Media items
  const mediaData = [
    // Books/PDFs
    {
      title: "The Foundations of Christian Discipleship",
      type: "book",
      url: "https://example.com/books/foundations-discipleship.pdf",
      filename: "foundations-discipleship.pdf",
      size: 2500000,
      mimeType: "application/pdf",
      categorySlug: "discipleship",
    },
    {
      title: "Understanding the Gospel of John - Study Guide",
      type: "book",
      url: "https://example.com/books/john-study-guide.pdf",
      filename: "john-study-guide.pdf",
      size: 1800000,
      mimeType: "application/pdf",
      categorySlug: "bible-study",
    },
    {
      title: "Prayer: Conversing with the Almighty",
      type: "book",
      url: "https://example.com/books/prayer-guide.pdf",
      filename: "prayer-guide.pdf",
      size: 950000,
      mimeType: "application/pdf",
      categorySlug: "prayer",
    },
    {
      title: "Marriage God's Way - Couples Workbook",
      type: "book",
      url: "https://example.com/books/marriage-workbook.pdf",
      filename: "marriage-workbook.pdf",
      size: 3200000,
      mimeType: "application/pdf",
      categorySlug: "family-marriage",
    },
    {
      title: "Daily Devotional Guide - 365 Days",
      type: "book",
      url: "https://example.com/books/365-devotional.pdf",
      filename: "365-devotional.pdf",
      size: 5500000,
      mimeType: "application/pdf",
      categorySlug: "devotionals",
    },
    {
      title: "New Believer's Handbook",
      type: "book",
      url: "https://example.com/books/new-believers.pdf",
      filename: "new-believers.pdf",
      size: 1200000,
      mimeType: "application/pdf",
      categorySlug: "discipleship",
    },
    {
      title: "The Book of Romans - Verse by Verse Commentary",
      type: "book",
      url: "https://example.com/books/romans-commentary.pdf",
      filename: "romans-commentary.pdf",
      size: 8900000,
      mimeType: "application/pdf",
      categorySlug: "commentary",
    },
    {
      title: "Youth Ministry Training Manual",
      type: "book",
      url: "https://example.com/books/youth-training.pdf",
      filename: "youth-training.pdf",
      size: 4200000,
      mimeType: "application/pdf",
      categorySlug: "youth-ministry",
    },

    // Videos (YouTube)
    {
      title: "The Sermon on the Mount - Full Teaching Series",
      type: "video",
      url: "https://www.youtube.com/watch?v=3ZmHlAz_Gkw",
      filename: "sermon-mount-series.mp4",
      size: null,
      mimeType: "video/mp4",
      categorySlug: "teachings",
    },
    {
      title: "How to Study the Bible Effectively",
      type: "video",
      url: "https://www.youtube.com/watch?v=ZU604QC_z6k",
      filename: "study-bible.mp4",
      size: null,
      mimeType: "video/mp4",
      categorySlug: "bible-study",
    },
    {
      title: "The Power of Prayer - Pastor's Message",
      type: "video",
      url: "https://www.youtube.com/watch?v=jdqsiFw74Jw",
      filename: "power-prayer.mp4",
      size: null,
      mimeType: "video/mp4",
      categorySlug: "prayer",
    },
    {
      title: "Building Strong Christian Families",
      type: "video",
      url: "https://www.youtube.com/watch?v=qYcGL5XHCJI",
      filename: "strong-families.mp4",
      size: null,
      mimeType: "video/mp4",
      categorySlug: "family-marriage",
    },
    {
      title: "Understanding Grace - Theological Deep Dive",
      type: "video",
      url: "https://www.youtube.com/watch?v=sYiM-sOC6nE",
      filename: "understanding-grace.mp4",
      size: null,
      mimeType: "video/mp4",
      categorySlug: "teachings",
    },
    {
      title: "Reaching Gen Z for Christ",
      type: "video",
      url: "https://www.youtube.com/watch?v=RiPiq2GpZtE",
      filename: "reaching-genz.mp4",
      size: null,
      mimeType: "video/mp4",
      categorySlug: "youth-ministry",
    },
    {
      title: "The Holy Spirit - Who He Is and What He Does",
      type: "video",
      url: "https://www.youtube.com/watch?v=oNNZO9i1Ghs",
      filename: "holy-spirit.mp4",
      size: null,
      mimeType: "video/mp4",
      categorySlug: "teachings",
    },
    {
      title: "Spiritual Disciplines for Modern Christians",
      type: "video",
      url: "https://www.youtube.com/watch?v=fQTHjjWn2lg",
      filename: "spiritual-disciplines.mp4",
      size: null,
      mimeType: "video/mp4",
      categorySlug: "discipleship",
    },

    // Images
    {
      title: "The Cross at Sunset",
      type: "image",
      url: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1200",
      filename: "cross-sunset.jpg",
      size: 245000,
      mimeType: "image/jpeg",
      categorySlug: "devotionals",
    },
    {
      title: "Open Bible on Wooden Table",
      type: "image",
      url: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1200",
      filename: "open-bible.jpg",
      size: 312000,
      mimeType: "image/jpeg",
      categorySlug: "bible-study",
    },
    {
      title: "Hands in Prayer",
      type: "image",
      url: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=1200",
      filename: "hands-prayer.jpg",
      size: 189000,
      mimeType: "image/jpeg",
      categorySlug: "prayer",
    },
    {
      title: "Family Reading Bible Together",
      type: "image",
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200",
      filename: "family-bible.jpg",
      size: 423000,
      mimeType: "image/jpeg",
      categorySlug: "family-marriage",
    },
    {
      title: "Mountain Sunrise - God's Creation",
      type: "image",
      url: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200",
      filename: "mountain-sunrise.jpg",
      size: 567000,
      mimeType: "image/jpeg",
      categorySlug: "devotionals",
    },
    {
      title: "Ancient Scrolls",
      type: "image",
      url: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=1200",
      filename: "ancient-scrolls.jpg",
      size: 234000,
      mimeType: "image/jpeg",
      categorySlug: "commentary",
    },
    {
      title: "Youth Worship Service",
      type: "image",
      url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200",
      filename: "youth-worship.jpg",
      size: 398000,
      mimeType: "image/jpeg",
      categorySlug: "youth-ministry",
    },
    {
      title: "Starry Night Sky - The Heavens Declare",
      type: "image",
      url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200",
      filename: "starry-night.jpg",
      size: 612000,
      mimeType: "image/jpeg",
      categorySlug: "teachings",
    },
    {
      title: "Church Interior",
      type: "image",
      url: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1200",
      filename: "church-interior.jpg",
      size: 445000,
      mimeType: "image/jpeg",
      categorySlug: "devotionals",
    },
    {
      title: "Baptism Service",
      type: "image",
      url: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1200",
      filename: "baptism.jpg",
      size: 278000,
      mimeType: "image/jpeg",
      categorySlug: "discipleship",
    },
  ];

  // Create media items
  for (const media of mediaData) {
    await prisma.media.create({
      data: {
        title: media.title,
        type: media.type,
        url: media.url,
        filename: media.filename,
        size: media.size,
        mimeType: media.mimeType,
        categoryId: media.categorySlug ? categories[media.categorySlug] : null,
      },
    });
  }
  console.log(`Media items created: ${mediaData.length}`);

  console.log("\nSeeding complete!");
  console.log("-------------------");
  console.log("Admin login: uchenna.ogbodo.001@gmail.com / Sinach=1234");
  console.log("Security answers: 'obatej' / 'silver'");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
