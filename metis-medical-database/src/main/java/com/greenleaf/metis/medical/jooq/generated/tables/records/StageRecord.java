/*
 * This file is generated by jOOQ.
 */
package com.greenleaf.metis.medical.jooq.generated.tables.records;


import com.greenleaf.metis.medical.jooq.generated.tables.Stage;

import javax.annotation.Generated;

import org.jooq.Field;
import org.jooq.Record1;
import org.jooq.Record4;
import org.jooq.Row4;
import org.jooq.impl.UpdatableRecordImpl;


/**
 * This class is generated by jOOQ.
 */
@Generated(
    value = {
        "http://www.jooq.org",
        "jOOQ version:3.11.5"
    },
    comments = "This class is generated by jOOQ"
)
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class StageRecord extends UpdatableRecordImpl<StageRecord> implements Record4<Integer, String, Integer, Integer> {

    private static final long serialVersionUID = 1168748312;

    /**
     * Setter for <code>public.stage.id</code>.
     */
    public void setId(Integer value) {
        set(0, value);
    }

    /**
     * Getter for <code>public.stage.id</code>.
     */
    public Integer getId() {
        return (Integer) get(0);
    }

    /**
     * Setter for <code>public.stage.name</code>.
     */
    public void setName(String value) {
        set(1, value);
    }

    /**
     * Getter for <code>public.stage.name</code>.
     */
    public String getName() {
        return (String) get(1);
    }

    /**
     * Setter for <code>public.stage.seq</code>.
     */
    public void setSeq(Integer value) {
        set(2, value);
    }

    /**
     * Getter for <code>public.stage.seq</code>.
     */
    public Integer getSeq() {
        return (Integer) get(2);
    }

    /**
     * Setter for <code>public.stage.vignette_id</code>.
     */
    public void setVignetteId(Integer value) {
        set(3, value);
    }

    /**
     * Getter for <code>public.stage.vignette_id</code>.
     */
    public Integer getVignetteId() {
        return (Integer) get(3);
    }

    // -------------------------------------------------------------------------
    // Primary key information
    // -------------------------------------------------------------------------

    /**
     * {@inheritDoc}
     */
    @Override
    public Record1<Integer> key() {
        return (Record1) super.key();
    }

    // -------------------------------------------------------------------------
    // Record4 type implementation
    // -------------------------------------------------------------------------

    /**
     * {@inheritDoc}
     */
    @Override
    public Row4<Integer, String, Integer, Integer> fieldsRow() {
        return (Row4) super.fieldsRow();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Row4<Integer, String, Integer, Integer> valuesRow() {
        return (Row4) super.valuesRow();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Integer> field1() {
        return Stage.STAGE.ID;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<String> field2() {
        return Stage.STAGE.NAME;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Integer> field3() {
        return Stage.STAGE.SEQ;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Integer> field4() {
        return Stage.STAGE.VIGNETTE_ID;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Integer component1() {
        return getId();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String component2() {
        return getName();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Integer component3() {
        return getSeq();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Integer component4() {
        return getVignetteId();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Integer value1() {
        return getId();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String value2() {
        return getName();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Integer value3() {
        return getSeq();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Integer value4() {
        return getVignetteId();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public StageRecord value1(Integer value) {
        setId(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public StageRecord value2(String value) {
        setName(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public StageRecord value3(Integer value) {
        setSeq(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public StageRecord value4(Integer value) {
        setVignetteId(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public StageRecord values(Integer value1, String value2, Integer value3, Integer value4) {
        value1(value1);
        value2(value2);
        value3(value3);
        value4(value4);
        return this;
    }

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    /**
     * Create a detached StageRecord
     */
    public StageRecord() {
        super(Stage.STAGE);
    }

    /**
     * Create a detached, initialised StageRecord
     */
    public StageRecord(Integer id, String name, Integer seq, Integer vignetteId) {
        super(Stage.STAGE);

        set(0, id);
        set(1, name);
        set(2, seq);
        set(3, vignetteId);
    }
}
