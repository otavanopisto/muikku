-- Using ID range 10000-10999
SET REFERENTIAL_INTEGRITY FALSE;
INSERT INTO binarymaterial VALUES ('00','text/x-java-properties',10000);
INSERT INTO htmlmaterial VALUES ('<html><body>\n                    <p>Testi k&auml;ytt&auml;j&auml;tarinalle #100020: Opiskeljana haluan voida vastata tekstimuotoiseen kentt&auml;&auml;n</p>\n                    <p>\n                        <strong>Yksirivinen tekstikentt&auml;:</strong>\n                    </p>\n                    <p>\n                        <object type=''application/vnd.muikku.field.text''><param name=''type'' value=''application/json''><param name=''content'' value=''{&quot;name&quot;:&quot;param1&quot;,&quot;rightAnswers&quot;:[],&quot;columns&quot;:20,&quot;hint&quot;:&quot;Vihjeteksti&quot;,&quot;help&quot;:&quot;Ohjeteksti&quot;}''><input name=''param1'' size=''20'' type=''text''></object>\n                    </p>\n                    <p>\n                        <strong>Muistiokentt&auml;:</strong>\n                    </p>\n                    <p>\n                        <object type=''application/vnd.muikku.field.memo''><param name=''type'' value=''application/json''><param name=''content'' value=''{&quot;name&quot;:&quot;param2&quot;,&quot;columns&quot;:20,&quot;rows&quot;:2,&quot;help&quot;:&quot;Ohjeteksti&quot;,&quot;hint&quot;:&quot;Vihjeteksti&quot;}''><textarea cols=''20'' name=''param2'' placeholder=''Ohjeteksti'' rows=''2'' title=''Vihjeteksti''></textarea></object>\n                    </p>\n                </body></html>'
    ,10002),
    ('<html><body>\n                            <p>Kiitos vastauksestasi</p>\n                        </body></html>'
    ,10003),
    ('<html><body>\n                            <p>Kysely&auml; ty&ouml;stet&auml;&auml;n</p>\n                        </body></html>'
    ,10004),
    ('<html><body>\n                            <p>Olet jo vastannut kyselyyn</p>\n                        </body></html>'
    ,10005),
    ('<html><body>\n                            <p>Kysely on suljettu</p>\n                        </body></html>'
    ,10006),
    ('<html><body>\n                    <p>Testimateriaali k&auml;ytt&auml;j&auml;tarinalle #100021: Opiskeljana haluan voida vastata yksivalinta -tyyppisiin teht&auml;viin</p>\n                    <p>\n                        <strong>Alaspudotus</strong>\n                    </p>\n                    <p>\n                        <object type=''application/vnd.muikku.field.select''><param name=''type'' value=''application/json''><param name=''content'' value=''{&quot;name&quot;:&quot;param1&quot;,&quot;listType&quot;:&quot;dropdown&quot;,&quot;size&quot;:null,&quot;options&quot;:[{&quot;name&quot;:&quot;1&quot;,&quot;points&quot;:null,&quot;text&quot;:&quot;Valinta 1&quot;},{&quot;name&quot;:&quot;2&quot;,&quot;points&quot;:null,&quot;text&quot;:&quot;Valinta 2&quot;},{&quot;name&quot;:&quot;3&quot;,&quot;points&quot;:null,&quot;text&quot;:&quot;Valinta 3&quot;}]}''><select name=''param1''><option value=''1''>Valinta 1</option><option value=''2''>Valinta 2</option><option value=''3''>Valinta 3</option></select></object>\n                    </p>\n                    <p>\n                        <strong>Pystysuora radionappilista</strong>\n                    </p>\n                    <p>\n                        <object type=''application/vnd.muikku.field.select''><param name=''type'' value=''application/json''><param name=''content'' value=''{&quot;name&quot;:&quot;param2&quot;,&quot;listType&quot;:&quot;radio&quot;,&quot;size&quot;:null,&quot;options&quot;:[{&quot;name&quot;:&quot;1&quot;,&quot;points&quot;:null,&quot;text&quot;:&quot;Valinta 1&quot;},{&quot;name&quot;:&quot;2&quot;,&quot;points&quot;:null,&quot;text&quot;:&quot;Valinta 2&quot;},{&quot;name&quot;:&quot;3&quot;,&quot;points&quot;:null,&quot;text&quot;:&quot;Valinta 3&quot;}]}''><input name=''param2'' type=''radio'' value=''1''><label>Valinta 1</label><br><input name=''param2'' type=''radio'' value=''2''><label>Valinta 2</label><br><input name=''param2'' type=''radio'' value=''3''><label>Valinta 3</label><br></object>\n                    </p>\n                    <p>\n                        <strong>Vaakasuora radionappilista</strong>\n                    </p>\n                    <p>\n                        <object type=''application/vnd.muikku.field.select''><param name=''type'' value=''application/json''><param name=''content'' value=''{&quot;name&quot;:&quot;param3&quot;,&quot;listType&quot;:&quot;radio_horz&quot;,&quot;size&quot;:null,&quot;options&quot;:[{&quot;name&quot;:&quot;1&quot;,&quot;points&quot;:null,&quot;text&quot;:&quot;Valinta 1&quot;},{&quot;name&quot;:&quot;2&quot;,&quot;points&quot;:null,&quot;text&quot;:&quot;Valinta 2&quot;},{&quot;name&quot;:&quot;3&quot;,&quot;points&quot;:null,&quot;text&quot;:&quot;Valinta 3&quot;}]}''><input name=''param3'' type=''radio'' value=''1''><label>Valinta 1</label><input name=''param3'' type=''radio'' value=''2''><label>Valinta 2</label><input name=''param3'' type=''radio'' value=''3''><label>Valinta 3</label></object>\n                    </p>\n                    <p>\n                        <strong>Lista</strong>\n                    </p>\n                    <p>\n                        <object type=''application/vnd.muikku.field.select''><param name=''type'' value=''application/json''><param name=''content'' value=''{&quot;name&quot;:&quot;param4&quot;,&quot;listType&quot;:&quot;list&quot;,&quot;size&quot;:3,&quot;options&quot;:[{&quot;name&quot;:&quot;1&quot;,&quot;points&quot;:null,&quot;text&quot;:&quot;Valinta 1&quot;},{&quot;name&quot;:&quot;2&quot;,&quot;points&quot;:null,&quot;text&quot;:&quot;Valinta 2&quot;},{&quot;name&quot;:&quot;3&quot;,&quot;points&quot;:null,&quot;text&quot;:&quot;Valinta 3&quot;}]}''><select name=''param4'' size=''3''><option value=''1''>Valinta 1</option><option value=''2''>Valinta 2</option><option value=''3''>Valinta 3</option></select></object>\n                    </p>\n                    <p>&nbsp;</p>\n                </body></html>'
    ,10007),
    ('<html><body>\n                            <p>Kiitos vastauksestasi</p>\n                        </body></html>'
    ,10008),
    ('<html><body>\n                            <p>Kysely&auml; ty&ouml;stet&auml;&auml;n</p>\n                        </body></html>'
    ,10009),
    ('<html><body>\n                            <p>Olet jo vastannut kyselyyn</p>\n                        </body></html>'
    ,10010),
    ('<html><body>\n                            <p>Kysely on suljettu</p>\n                        </body></html>'
    ,10011),
    ('<html><body>\n                    <p>Testi k&auml;ytt&auml;j&auml;tarinalle #100022: Opiskelijana haluan voida vasta yhdistelyteht&auml;viin</p>\n                    <p>\n                        <strong>Yhtenev&auml; m&auml;&auml;r&auml; valintoja</strong>\n                    </p>\n                    <p>\n                        <object type=''application/vnd.muikku.field.connect''><param name=''type'' value=''application/json''><param name=''content'' value=''{&quot;name&quot;:&quot;param1&quot;,&quot;counterparts&quot;:[{&quot;name&quot;:&quot;A&quot;,&quot;text&quot;:&quot;Vastine 3&quot;},{&quot;name&quot;:&quot;B&quot;,&quot;text&quot;:&quot;Vastine 2&quot;},{&quot;name&quot;:&quot;C&quot;,&quot;text&quot;:&quot;Vastine 1&quot;}],&quot;connections&quot;:[{&quot;field&quot;:&quot;1&quot;,&quot;counterpart&quot;:&quot;C&quot;},{&quot;field&quot;:&quot;2&quot;,&quot;counterpart&quot;:&quot;B&quot;},{&quot;field&quot;:&quot;3&quot;,&quot;counterpart&quot;:&quot;A&quot;}],&quot;fields&quot;:[{&quot;name&quot;:&quot;1&quot;,&quot;text&quot;:&quot;Termi 1&quot;},{&quot;name&quot;:&quot;2&quot;,&quot;text&quot;:&quot;Termi 2&quot;},{&quot;name&quot;:&quot;3&quot;,&quot;text&quot;:&quot;Termi 3&quot;}]}''><table><tbody><tr><td>Termi 1</td><td><input data-fieldcount=''0'' name=''param1'' type=''text''></td><td>Vastine 3</td></tr><tr><td>Termi 2</td><td><input data-fieldcount=''1'' name=''param1'' type=''text''></td><td>Vastine 2</td></tr><tr><td>Termi 3</td><td><input data-fieldcount=''2'' name=''param1'' type=''text''></td><td>Vastine 1</td></tr></tbody></table></object>\n                    </p>\n                    <p>\n                        <strong>Eri&auml;v&auml; m&auml;&auml;r&auml; valintoja</strong>\n                    </p>\n                    <p>\n                        <object type=''application/vnd.muikku.field.connect''><param name=''type'' value=''application/json''><param name=''content'' value=''{&quot;name&quot;:&quot;param2&quot;,&quot;counterparts&quot;:[{&quot;name&quot;:&quot;A&quot;,&quot;text&quot;:&quot;Vasrine 3&quot;},{&quot;name&quot;:&quot;B&quot;,&quot;text&quot;:&quot;Vastine 1&quot;},{&quot;name&quot;:&quot;C&quot;,&quot;text&quot;:&quot;Vastine 2&quot;}],&quot;connections&quot;:[{&quot;field&quot;:&quot;1&quot;,&quot;counterpart&quot;:&quot;B&quot;},{&quot;field&quot;:&quot;2&quot;,&quot;counterpart&quot;:&quot;C&quot;},{&quot;field&quot;:&quot;3&quot;,&quot;counterpart&quot;:&quot;null&quot;}],&quot;fields&quot;:[{&quot;name&quot;:&quot;1&quot;,&quot;text&quot;:&quot;Termi 1&quot;},{&quot;name&quot;:&quot;2&quot;,&quot;text&quot;:&quot;Termi 2&quot;},{&quot;name&quot;:&quot;3&quot;,&quot;text&quot;:&quot;null&quot;}]}''><table><tbody><tr><td>Termi 1</td><td><input data-fieldcount=''0'' name=''param2'' type=''text''></td><td>Vasrine 3</td></tr><tr><td>Termi 2</td><td><input data-fieldcount=''1'' name=''param2'' type=''text''></td><td>Vastine 1</td></tr><tr><td>null</td><td><input data-fieldcount=''2'' name=''param2'' type=''text''></td><td>Vastine 2</td></tr></tbody></table></object>\n                    </p>\n                </body></html>'
    ,10012),
    ('<html><body>\n                            <p>Kiitos vastauksestasi</p>\n                        </body></html>'
    ,10013),
    ('<html><body>\n                            <p>Kysely&auml; ty&ouml;stet&auml;&auml;n</p>\n                        </body></html>'
    ,10014),
    ('<html><body>\n                            <p>Olet jo vastannut kyselyyn</p>\n                        </body></html>'
    ,10015),
    ('<html><body>\n                            <p>Kysely on suljettu</p>\n                        </body></html>'
    ,10016),
    ('<html><body>\n                    <p>&nbsp;Testi k&auml;ytt&auml;j&auml;tarinalle #100024: Opiskelijana haluan voida vastata moninvalinta tyyppisiin teht&auml;viin</p>\n                    <p>\n                        <object type=''application/vnd.muikku.field.checklist''><param name=''type'' value=''application/json''><param name=''content'' value=''{&quot;name&quot;:&quot;param1&quot;,&quot;options&quot;:[{&quot;name&quot;:&quot;1&quot;,&quot;points&quot;:null,&quot;text&quot;:&quot;Vaihtoehto 1&quot;},{&quot;name&quot;:&quot;2&quot;,&quot;points&quot;:null,&quot;text&quot;:&quot;Vaihtoehto 2&quot;},{&quot;name&quot;:&quot;3&quot;,&quot;points&quot;:null,&quot;text&quot;:&quot;Vaihtoehto 3&quot;}]}''><input name=''param1'' type=''checkbox'' value=''1''><label>Vaihtoehto 1</label><input name=''param1'' type=''checkbox'' value=''2''><label>Vaihtoehto 2</label><input name=''param1'' type=''checkbox'' value=''3''><label>Vaihtoehto 3</label></object>\n                    </p>\n                </body></html>'
    ,10017),
    ('<html><body>\n                            <p>Kiitos vastauksestasi</p>\n                        </body></html>'
    ,10018),
    ('<html><body>\n                            <p>Kysely&auml; ty&ouml;stet&auml;&auml;n</p>\n                        </body></html>'
    ,10019),
    ('<html><body>\n                            <p>Olet jo vastannut kyselyyn</p>\n                        </body></html>'
    ,10020),
    ('<html><body>\n                            <p>Kysely on suljettu</p>\n                        </body></html>'
    ,10021),
    ('<html><body>\n                    <p>Testit k&auml;ytt&auml;j&auml;tarinalle #100023:  Opiskelijana haluan voida vastata tiedostotyyppisiin teht&auml;viin </p>\n                    <p>\n                        <ixf:uploadfilefield xmlns:ixf=''http://www.internetix.fi/1999/XSL/Transform'' id=''upload1''>\n                            <paramname>param1</paramname>\n                        </ixf:uploadfilefield>\n                    </p>\n                </body></html>'
    ,10022),
    ('<html><body>\n                            <p>Kiitos vastauksestasi</p>\n                        </body></html>'
    ,10023),
    ('<html><body>\n                            <p>Kysely&auml; ty&ouml;stet&auml;&auml;n</p>\n                        </body></html>'
    ,10024),
    ('<html><body>\n                            <p>Olet jo vastannut kyselyyn</p>\n                        </body></html>'
    ,10025),
    ('<html><body>\n                            <p>Kysely on suljettu</p>\n                        </body></html>'
    ,10026),
    ('<html><body>\n                <p>&nbsp;<iframe border=''0'' frameborder=''0'' seamless=''seamless'' src=''/muikku/workspace/pool/materials/selenium/teht/us22?embed=true&amp;on=2081597&amp;rt=POOL'' title=''Yhdistelyteht&auml;v&auml; -vastaus'' width=''100%''>Browser does not support iframes</iframe>\n                    <iframe border=''0'' frameborder=''0'' seamless=''seamless'' src=''/muikku/workspace/pool/materials/selenium/teht/us21?embed=true&amp;on=2081591&amp;rt=POOL'' title=''Yksivalinta -tyyppinen vastaus'' width=''100%''>Browser does not support iframes</iframe>\n                    <iframe border=''0'' frameborder=''0'' seamless=''seamless'' src=''/muikku/workspace/pool/materials/selenium/teht/us20?embed=true&amp;on=2081568&amp;rt=POOL'' title=''Tekstikentt&auml; vastaus'' width=''100%''>Browser does not support iframes</iframe>\n                </p>\n            </body></html>'
    ,10027);
INSERT INTO material VALUES (10001,'[_DEUS_NEX_MACHINA_LOOKUP_]','[_DEUS_NEX_MACHINA_LOOKUP_]'),
    (10002,'Tekstikenttä vastaus','us20'),
    (10003,'FCK-dokumentti','_fckresponse'),
    (10004,'FCK-dokumentti','_fckunderconstruction'),
    (10005,'FCK-dokumentti','_fckalreadyreplied'),
    (10006,'FCK-dokumentti','_fckclosed'),
    (10007,'Yksivalinta -tyyppinen vastaus','us21'),
    (10008,'FCK-dokumentti','_fckresponse'),
    (10009,'FCK-dokumentti','_fckunderconstruction'),
    (10010,'FCK-dokumentti','_fckalreadyreplied'),
    (10011,'FCK-dokumentti','_fckclosed'),
    (10012,'Yhdistelytehtävä -vastaus','us22'),
    (10013,'FCK-dokumentti','_fckresponse'),
    (10014,'FCK-dokumentti','_fckunderconstruction'),
    (10015,'FCK-dokumentti','_fckalreadyreplied'),
    (10016,'FCK-dokumentti','_fckclosed'),
    (10017,'Moninvalintatehtävät','us24'),
    (10018,'FCK-dokumentti','_fckresponse'),
    (10019,'FCK-dokumentti','_fckunderconstruction'),
    (10020,'FCK-dokumentti','_fckalreadyreplied'),
    (10021,'FCK-dokumentti','_fckclosed'),
    (10022,'Tiedostotyyppiset -tehtävät','us23'),
    (10023,'FCK-dokumentti','_fckresponse'),
    (10024,'FCK-dokumentti','_fckunderconstruction'),
    (10025,'FCK-dokumentti','_fckalreadyreplied'),
    (10026,'FCK-dokumentti','_fckclosed'),
    (10027,'doc','doc');
INSERT INTO querychecklistfield VALUES (10009);
INSERT INTO querychecklistfieldoption VALUES (10001,'1','Vaihtoehto 1',10009),
    (10002,'2','Vaihtoehto 2',10009),
    (10003,'3','Vaihtoehto 3',10009);
INSERT INTO queryconnectfield VALUES (10007),
    (10008);
INSERT INTO queryconnectfieldcounterpart VALUES (10001),
    (10002),
    (10003),
    (10007),
    (10008),
    (10009);
INSERT INTO queryconnectfieldoption VALUES (10001,'A','Vastine 3',10007),
    (10002,'B','Vastine 2',10007),
    (10003,'C','Vastine 1',10007),
    (10004,'1','Termi 1',10007),
    (10005,'2','Termi 2',10007),
    (10006,'3','Termi 3',10007),
    (10007,'A','Vasrine 3',10008),
    (10008,'B','Vastine 1',10008),
    (10009,'C','Vastine 2',10008),
    (10010,'1','Termi 1',10008),
    (10011,'2','Termi 2',10008),
    (10012,'3','null',10008);
INSERT INTO queryconnectfieldterm VALUES (10012,NULL),
    (10006,10001),
    (10005,10002),
    (10004,10003),
    (10010,10008),
    (10011,10009);
INSERT INTO queryfield VALUES (10001,'param1',10002),
    (10002,'param2',10002),
    (10003,'param1',10007),
    (10004,'param2',10007),
    (10005,'param3',10007),
    (10006,'param4',10007),
    (10007,'param1',10012),
    (10008,'param2',10012),
    (10009,'param1',10017);
INSERT INTO queryselectfield VALUES (10003),
    (10004),
    (10005),
    (10006);
INSERT INTO queryselectfieldoption VALUES (10001,'1','Valinta 1',10003),
    (10002,'2','Valinta 2',10003),
    (10003,'3','Valinta 3',10003),
    (10004,'1','Valinta 1',10004),
    (10005,'2','Valinta 2',10004),
    (10006,'3','Valinta 3',10004),
    (10007,'1','Valinta 1',10005),
    (10008,'2','Valinta 2',10005),
    (10009,'3','Valinta 3',10005),
    (10010,'1','Valinta 1',10006),
    (10011,'2','Valinta 2',10006),
    (10012,'3','Valinta 3',10006);
INSERT INTO querytextfield VALUES (10001);
INSERT INTO workspacefolder VALUES ('selenium',10032),
    ('teht',10033);
INSERT INTO workspacematerial VALUES (10034,10002),
    (10035,10003),
    (10036,10004),
    (10037,10005),
    (10038,10006),
    (10039,10007),
    (10040,10008),
    (10041,10009),
    (10042,10010),
    (10043,10011),
    (10044,10012),
    (10045,10013),
    (10046,10014),
    (10047,10015),
    (10048,10016),
    (10049,10017),
    (10050,10018),
    (10051,10019),
    (10052,10020),
    (10053,10021),
    (10054,10022),
    (10055,10023),
    (10056,10024),
    (10057,10025),
    (10058,10026),
    (10059,10027);
INSERT INTO workspacematerialfield VALUES (10001,'8e2c010a5e55cdfe5a8019e0156b1364',10001,10034),
    (10002,'4af7f3cba5d9b1f9f7411fbed3de488b',10002,10034),
    (10003,'3500d8fb1bddeafbb54086074d258dab',10003,10039),
    (10004,'8dc539a708537ba2a266c043365d798a',10004,10039),
    (10005,'c3fca45a221c5dfd287fd6936184a5a6',10005,10039),
    (10006,'4d3f80dfa3207f12be6f886c507d3688',10006,10039),
    (10007,'afa15a0a4def3ca7ccc3fef04b561a71',10007,10044),
    (10008,'4614bab46e682340b063ff70429885f1',10008,10044),
    (10009,'ab8136ff1150e0c8ee36349969df53bb',10009,10049),
    (10010,'0cadcc7b44a929ebc0f0c639a8faae7b',10007,10059),
    (10011,'0e410d0d9c4e0fd674254ff7f0f5a207',10008,10059),
    (10012,'31ce354e6086a451a0ae2b0ba5af6d65',10003,10059),
    (10013,'2a9cd1ea11120ededb59d5849debd74b',10004,10059),
    (10014,'4827c775869af836e9a30e1f0d15bc03',10005,10059),
    (10015,'38c00a29725de8f64ea50fdbfdb5e961',10006,10059),
    (10016,'5183adbaf3ba8eea33fdcf6aefafe132',10001,10059),
    (10017,'fa8c0ccf0e14b5dfce2dec99614df2a8',10002,10059);
INSERT INTO workspacenode VALUES (10032,'selenium',(select id from WorkspaceNode where urlName = 'selenium-tests')),
    (10033,'teht',10032),
    (10034,'us20',10033),
    (10035,'_fckresponse',10034),
    (10036,'_fckunderconstruction',10034),
    (10037,'_fckalreadyreplied',10034),
    (10038,'_fckclosed',10034),
    (10039,'us21',10033),
    (10040,'_fckresponse',10039),
    (10041,'_fckunderconstruction',10039),
    (10042,'_fckalreadyreplied',10039),
    (10043,'_fckclosed',10039),
    (10044,'us22',10033),
    (10045,'_fckresponse',10044),
    (10046,'_fckunderconstruction',10044),
    (10047,'_fckalreadyreplied',10044),
    (10048,'_fckclosed',10044),
    (10049,'us24',10033),
    (10050,'_fckresponse',10049),
    (10051,'_fckunderconstruction',10049),
    (10052,'_fckalreadyreplied',10049),
    (10053,'_fckclosed',10049),
    (10054,'us23',10033),
    (10055,'_fckresponse',10054),
    (10056,'_fckunderconstruction',10054),
    (10057,'_fckalreadyreplied',10054),
    (10058,'_fckclosed',10054),
    (10059,'doc',10032);
SET REFERENTIAL_INTEGRITY TRUE;
